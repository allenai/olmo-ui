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
export interface ModelInfo {
    id: string;
    name?: string; // Make name optional to match Model type
    host: string;
    rootThreadId?: string; // For follow-up messages in multi-model
}

export interface StreamMessageVariables extends StreamMessageRequest {
    // TODO: Temp - overrideModel will be removed when model selection is unified
    overrideModel?: ModelInfo;
    
    // For multiple models (new functionality)
    models?: ModelInfo[];
}

export interface StreamMessageResult {
    // TODO: Temp - Single model fields for backward compatibility, will be unified later
    threadId?: string;
    messageId?: string;
    content?: string;
    error?: Error;
    limitReached?: boolean;
    isFirstThreadMessage?: boolean;
    
    // Multi-model fields
    threadIds?: string[];
    messageIds?: string[];
    errors?: Error[];
    modelResults?: SingleModelResult[];
    isMultiModel?: boolean;
}

export interface SingleModelResult {
    threadId?: string;
    messageId?: string;
    content?: string;
    error?: Error;
    limitReached?: boolean;
    modelInfo: ModelInfo;
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

    // Adds content to a message, with robust error handling
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

    // Process a single model stream
    // TODO: Temp - Will be fully replaced by the parallel multi-model approach
    const streamSingleModel = useCallback(async (variables: StreamMessageVariables): Promise<StreamMessageResult> => {
        // Initialize result and context
        const result: StreamMessageResult = {};
        const context: StreamMessageContext = {
            abortController: new AbortController(),
            isUpdatingContent: false,
            isCreatingNewThread: variables.parent == null
        };

        // TODO: Temp - Will use models array directly when model selection is unified
        // Use override model if provided, otherwise fall back to selectedModel
        const modelToUse = variables.overrideModel || selectedModel;

        console.log(`DEBUG: useStreamMessage (single model) called`, {
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
        // Also remove models array if present
        delete (request as any).models;

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

    // Process multiple models sequentially
    // TODO: Temp - Will be replaced with parallel execution in future updates
    const streamMultipleModels = useCallback(async (variables: StreamMessageVariables): Promise<StreamMessageResult> => {
        const models = variables.models || [];
        const modelResults: SingleModelResult[] = [];
        const threadIds: string[] = [];
        const messageIds: string[] = [];
        const errors: Error[] = [];

        console.log(`DEBUG: Processing ${models.length} models sequentially`, {
            models: models.map(m => m.name)
        });

        // TODO: Temp compatibility - remove when Zustand streaming state is fully migrated
        appContext.setState({ 
            streamPromptState: RemoteState.Loading,
            abortController: new AbortController()
        });

        // TODO: Temp - Sequential processing will be replaced with Promise.all for parallel execution
        // Process each model sequentially for now
        for (let i = 0; i < models.length; i++) {
            const model = models[i];
            
            console.log(`DEBUG: Processing model ${i+1}/${models.length}: ${model.name}`, {
                rootThreadId: model.rootThreadId || 'none'
            });
            
            try {
                // For follow-ups, get the last message ID for this specific thread
                let parent = variables.parent;
                
                if (model.rootThreadId) {
                    try {
                        // Dynamic import to avoid circular dependencies
                        const { getThread } = require('@/api/playgroundApi/thread');
                        const threadData = await getThread(model.rootThreadId);
                        const lastMessage = threadData.messages[threadData.messages.length - 1];
                        parent = lastMessage.id;
                        
                        console.log(`DEBUG: Using last message from thread for ${model.name}`, {
                            threadId: model.rootThreadId,
                            lastMessageId: lastMessage.id
                        });
                    } catch (error) {
                        console.log(`DEBUG: Failed to get last message for thread ${model.rootThreadId}:`, error);
                        // Continue without parent - will create new thread
                    }
                }

                // Create a single-model request
                const singleModelRequest: StreamMessageVariables = {
                    ...variables,
                    parent,
                    overrideModel: {
                        id: model.id,
                        name: model.name,
                        host: model.host
                    }
                };
                
                // Process this model
                const result = await streamSingleModel(singleModelRequest);
                
                // Store the results
                const modelResult: SingleModelResult = {
                    threadId: result.threadId,
                    messageId: result.messageId,
                    content: result.content,
                    error: result.error,
                    limitReached: result.limitReached,
                    modelInfo: model
                };
                
                modelResults.push(modelResult);
                
                if (result.threadId) {
                    threadIds.push(result.threadId);
                }
                
                if (result.messageId) {
                    messageIds.push(result.messageId);
                }
                
                if (result.error) {
                    errors.push(result.error);
                }
            } catch (error) {
                console.log(`DEBUG: Error processing model ${model.name}:`, error);
                
                // Create error result with guaranteed Error object
                const errorObj = error instanceof Error ? error : new Error(String(error));
                const modelResult: SingleModelResult = {
                    error: errorObj,
                    modelInfo: model
                };
                
                modelResults.push(modelResult);
                errors.push(errorObj);
                
                // Add user-friendly error message
                addSnackMessage({
                    type: SnackMessageType.Brief,
                    id: `model-error-${model.id}-${Date.now()}`,
                    message: `Error streaming ${model.name}: ${errorObj.message}`
                });
            }
        }
        
        // TODO: Temp compatibility - remove when Zustand streaming state is fully migrated
        appContext.setState({ 
            streamPromptState: RemoteState.Loaded,
            abortController: null
        });

        console.log(`DEBUG: Completed processing ${models.length} models`, {
            threadIds,
            successful: threadIds.length,
            failed: errors.length
        });

        // Return aggregated results
        return {
            isMultiModel: true,
            threadIds,
            threadId: threadIds[0], // For backward compatibility
            messageIds,
            messageId: messageIds[0], // For backward compatibility
            errors: errors.length > 0 ? errors : undefined,
            modelResults
        };
    }, [streamSingleModel, addSnackMessage]);

    // Main mutation function
    const streamMessage = useCallback(async (variables: StreamMessageVariables): Promise<StreamMessageResult> => {
        // Determine if this is a multi-model request
        const isMultiModel = !!variables.models && variables.models.length > 0;
        
        console.log(`DEBUG: Stream request received`, {
            isMultiModel,
            modelCount: isMultiModel ? variables.models!.length : 1
        });
        
        // For multi-model case
        if (isMultiModel) {
            return streamMultipleModels(variables);
        }
        
        // TODO: Temp - Single model case for backward compatibility, will be unified later
        return streamSingleModel(variables);
    }, [streamSingleModel, streamMultipleModels]);

    // Create the React Query mutation with proper typing
    const mutation = useMutation<
        StreamMessageResult,
        Error,
        StreamMessageVariables
    >({
        mutationFn: streamMessage,
        onMutate: (variables) => {
            const isMultiModel = !!variables.models && variables.models.length > 0;
            const modelName = isMultiModel 
                ? `${variables.models!.length} models` 
                : variables.overrideModel?.name || 'no-model';
                
            console.log('D$> RQ mutation start:', modelName);
            
            // For single-model, set Zustand state
            if (!isMultiModel) {
                // TODO: Temp compatibility - remove when Zustand streaming state is fully migrated
                appContext.setState({ 
                    streamPromptState: RemoteState.Loading,
                    abortController: new AbortController() // This will be used by existing abort logic
                });
            }
        },
        onSuccess: (result) => {
            const threadIdLog = result.isMultiModel 
                ? `${result.threadIds?.length || 0} threads` 
                : result.threadId || 'none';
                
            console.log('D$> RQ success:', threadIdLog);
            
            // For single-model, reset Zustand state
            if (!result.isMultiModel) {
                // TODO: Temp compatibility - remove when Zustand streaming state is fully migrated
                appContext.setState({ 
                    streamPromptState: RemoteState.Loaded,
                    abortController: null
                });
            }
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