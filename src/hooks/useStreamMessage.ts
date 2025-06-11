import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';

import { 
    isFinalMessage, 
    isFirstMessage, 
    isMessageChunk, 
    Message, 
    MessageStreamError, 
    MessageStreamErrorReason, 
    parseMessage, 
    StreamBadRequestError, 
    V4CreateMessageRequest 
} from '@/api/Message';
import { threadQueryOptions } from '@/api/playgroundApi/thread';
import { postMessageGenerator } from '@/api/postMessageGenerator';
import { queryClient } from '@/api/query-client';
import { Role } from '@/api/Role';
import { appContext, useAppContext } from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import { getFeatureToggles } from '@/FeatureToggleContext';
import { StreamMessageRequest, StreamPromptResult } from '@/slices/ThreadUpdateSlice';
import { AlertMessageSeverity, errorToAlert, SnackMessage, SnackMessageType } from '@/slices/SnackMessageSlice';
import { analyticsClient } from '@/analytics/AnalyticsClient';
import { CompareModelState } from '@/slices/CompareModelSlice';

// Define clear interfaces for mutation types
export interface StreamMessageVariables extends StreamMessageRequest {
    overrideModel?: {
        id: string;
        name: string;
        host: string;
    };
}

export interface StreamMessageResult {
    threadId?: string;
    messageId?: string;
    content?: string;
    error?: Error;
    limitReached?: boolean;
    isFirstThreadMessage?: boolean;
}

export interface StreamMessageContext {
    abortController: AbortController;
    streamingMessageId?: string;
    isUpdatingContent: boolean;
    isCreatingNewThread: boolean;
}

const ABORT_ERROR_MESSAGE: SnackMessage = {
    type: SnackMessageType.Alert,
    id: `abort-message-${new Date().getTime()}`.toLowerCase(),
    title: 'Response was aborted',
    message: `You stopped OLMo from generating answers to your query`,
    severity: AlertMessageSeverity.Warning,
} as const;

export const useStreamMessage = () => {
    const {
        inferenceOpts,
        selectedModel,
        addContentToMessage,
        addChildToSelectedThread,
        addSnackMessage,
        setSelectedThread,
        setMessageLimitReached,
        getAttributionsForMessage,
    } = useAppContext();

    const handleFinalMessage = useAppContext((state) => state.handleFinalMessage);

    // This function safely adds content to a message, with proper error handling
    const safelyAddContentToMessage = (messageId: string, content: string) => {
        if (!messageId) {
            console.log('DEBUG: Cannot add content - missing messageId');
            return;
        }

        try {
            // Check if message exists in state before attempting to update
            const state = appContext.getState();
            const messageExists = state.selectedThreadMessagesById[messageId];
            
            if (!messageExists) {
                console.log(`DEBUG: Message ${messageId} not found in state, skipping content update`);
                return;
            }
            
            // Update the message content
            addContentToMessage(messageId, content);
        } catch (error) {
            console.error(`DEBUG: Error adding content to message ${messageId}:`, error);
            // Continue execution despite error
        }
    };

    // Extracted function to handle first message processing
    const handleFirstMessageReceived = (message: any, context: StreamMessageContext, result: StreamMessageResult) => {
        const parsedMessage = parseMessage(message);
        
        console.log(`DEBUG: First message created`, {
            messageId: parsedMessage.id,
            isCreatingNewThread: context.isCreatingNewThread
        });

        if (context.isCreatingNewThread) {
            setSelectedThread(parsedMessage);
            result.threadId = parsedMessage.id;
            result.isFirstThreadMessage = true;
            
            console.log(`DEBUG: New thread created`, {
                threadId: result.threadId
            });
        } else {
            addChildToSelectedThread(parsedMessage);
            
            // Store parent thread ID for follow-up messages
            result.threadId = parsedMessage.root;
            console.log(`DEBUG: Added child to existing thread`, {
                messageId: parsedMessage.id,
                parentId: parsedMessage.parent,
                rootThreadId: parsedMessage.root
            });
        }

        // Store the message id that is being generated
        let targetMessageList;
        if (parsedMessage.role === Role.User) {
            targetMessageList = parsedMessage.children;
        } else if (parsedMessage.role === Role.System) {
            // system prompt message should only have 1 child
            targetMessageList = parsedMessage.children?.[0]?.children;
        }

        const streamingMessage = targetMessageList?.find(
            (message) => !message.final && message.content.length === 0
        );

        if (streamingMessage) {
            context.streamingMessageId = streamingMessage.id;
            result.messageId = streamingMessage.id;
            
            // TODO: Temp compatibility - remove when Zustand streaming state is fully migrated
            appContext.setState({ streamingMessageId: streamingMessage.id });
        } else {
            console.log('DEBUG: Could not find streaming message ID in first message');
        }
    };

    // Extracted function to handle message chunks
    const handleMessageChunkReceived = (message: any, context: StreamMessageContext, result: StreamMessageResult) => {
        // TODO: Temp compatibility - remove when Zustand streaming state is fully migrated
        if (!appContext.getState().isUpdatingMessageContent) {
            appContext.setState({ isUpdatingMessageContent: true });
            context.isUpdatingContent = true;
        }

        safelyAddContentToMessage(message.message, message.content);
        
        // Update the content in our result for potential use by caller
        if (result.content === undefined) result.content = '';
        result.content += message.content;
    };

    // Extracted function to handle final message
    const handleFinalMessageReceived = async (message: any, context: StreamMessageContext, result: StreamMessageResult, request: V4CreateMessageRequest) => {
        const { isCorpusLinkEnabled } = getFeatureToggles();
        
        // Verify we have a streaming message ID
        if (!context.streamingMessageId) {
            const error = new Error('The streaming message ID was not set before streaming ended');
            console.error(error);
            throw error;
        }

        console.log(`DEBUG: Final message received`, {
            messageId: context.streamingMessageId,
            threadId: result.threadId
        });

        // Process the final message
        const parsedFinalMessage = parseMessage(message);
        handleFinalMessage(parsedFinalMessage, context.isCreatingNewThread);

        // Get attributions if enabled
        if (isCorpusLinkEnabled && context.streamingMessageId) {
            await getAttributionsForMessage(request.content, context.streamingMessageId);
        }
    };

    // Process a message stream with explicit context and result tracking
    const processMessageStream = async (
        request: V4CreateMessageRequest, 
        context: StreamMessageContext,
        result: StreamMessageResult
    ) => {
        const messageChunks = postMessageGenerator(request, context.abortController);

        // Process the streaming response
        let messageCount = 0;
        console.groupCollapsed('D$> RQ stream start');
        
        try {
            for await (const message of messageChunks) {
                messageCount++;
                if (messageCount % 10 === 1) console.log(`msg ${messageCount}`);
                
                if (isFirstMessage(message)) {
                    handleFirstMessageReceived(message, context, result);
                }

                if (isMessageChunk(message)) {
                    handleMessageChunkReceived(message, context, result);
                }

                if (isFinalMessage(message)) {
                    await handleFinalMessageReceived(message, context, result, request);
                }
            }
            console.groupEnd();
            console.log(`D$> RQ stream end, threadId:`, result.threadId || 'none');
        } catch (error) {
            console.groupEnd();
            console.log(`D$> RQ stream error:`, error instanceof Error ? error.message : 'unknown');
            throw error;
        }
    };

    // Main mutation function
    const streamMessage = useCallback(async (variables: StreamMessageVariables): Promise<StreamMessageResult> => {
        // Initialize result and context
        const result: StreamMessageResult = {};
        const context: StreamMessageContext = {
            abortController: new AbortController(),
            isUpdatingContent: false,
            isCreatingNewThread: variables.parent == null
        };

        // Use override model if provided, otherwise fall back to selectedModel
        const modelToUse = variables.overrideModel || selectedModel;

        console.log(`DEBUG: useStreamMessage called`, {
            isCreatingNewThread: context.isCreatingNewThread,
            selectedModel: selectedModel?.name || 'none',
            overrideModel: variables.overrideModel?.name || 'none',
            modelToUse: modelToUse?.name || 'none',
            modelId: modelToUse?.id,
            hasParent: !!variables.parent,
            content: variables.content?.substring(0, 50) + '...'
        });

        if (modelToUse == null) {
            console.log(`DEBUG: No model available`);
            addSnackMessage({
                type: SnackMessageType.Brief,
                id: `missing-model${new Date().getTime()}`,
                message: 'You must select a model before submitting a prompt.',
            });
            return result;
        }

        const request: V4CreateMessageRequest = {
            model: modelToUse.id,
            host: modelToUse.host,
            ...variables,
            ...inferenceOpts,
        };

        // Remove the overrideModel from the request since it's not part of the API
        delete (request as any).overrideModel;

        console.log(`DEBUG: Making API request`, {
            model: request.model,
            host: request.host,
            hasParent: !!request.parent
        });

        try {
            // Process the stream
            await processMessageStream(request, context, result);
            return result;
        } catch (err) {
            // Handle different error types
            let snackMessage = errorToAlert(
                `create-message-${new Date().getTime()}`.toLowerCase(),
                'Unable to Submit Message',
                err
            );

            if (err instanceof MessageStreamError) {
                if (err.finishReason === MessageStreamErrorReason.LENGTH) {
                    snackMessage = errorToAlert(
                        `create-message-${new Date().getTime()}`.toLowerCase(),
                        'Maximum Thread Length',
                        err
                    );

                    if (err.messageId) {
                        setMessageLimitReached(err.messageId, true);
                        result.limitReached = true;
                    }
                }

                if (err.finishReason === MessageStreamErrorReason.MODEL_OVERLOADED) {
                    analyticsClient.trackModelOverloadedError(request.model);

                    snackMessage = errorToAlert(
                        `create-message-${new Date().getTime()}`.toLowerCase(),
                        'This model is overloaded due to high demand. Please try again later or try another model.',
                        err
                    );
                }
            } else if (err instanceof StreamBadRequestError) {
                throw err;
            } else if (err instanceof Error) {
                if (err.name === 'AbortError') {
                    snackMessage = ABORT_ERROR_MESSAGE;
                }
            }

            addSnackMessage(snackMessage);
            throw err;
        }
    }, [
        selectedModel,
        inferenceOpts,
        addContentToMessage,
        addChildToSelectedThread,
        addSnackMessage,
        setSelectedThread,
        setMessageLimitReached,
        getAttributionsForMessage,
        handleFinalMessage
    ]);

    // Create the React Query mutation with proper typing
    const mutation = useMutation<
        StreamMessageResult,
        Error,
        StreamMessageVariables
    >({
        mutationFn: streamMessage,
        onMutate: (variables) => {
            console.log('D$> RQ mutation start:', variables.overrideModel?.name || 'no-model');
            // TODO: Temp compatibility - remove when Zustand streaming state is fully migrated
            appContext.setState({ 
                streamPromptState: RemoteState.Loading,
                abortController: new AbortController() // This will be used by existing abort logic
            });
        },
        onSuccess: (result) => {
            console.log('D$> RQ success, threadId:', result?.threadId || 'none');
            // TODO: Temp compatibility - remove when Zustand streaming state is fully migrated
            appContext.setState({ 
                streamPromptState: RemoteState.Loaded,
                abortController: null
            });
        },
        onError: (error) => {
            console.log('D$> RQ error:', error?.message || 'unknown');
            // TODO: Temp compatibility - remove when Zustand streaming state is fully migrated
            appContext.setState({ 
                streamPromptState: RemoteState.Error,
                abortController: null
            });
        }
    });

    return mutation;
}; 