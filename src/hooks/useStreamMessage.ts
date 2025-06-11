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

    const streamMessage = useCallback(async (newMessage: StreamMessageRequest): Promise<StreamPromptResult> => {
        const { isCorpusLinkEnabled } = getFeatureToggles();
        const abortController = new AbortController();
        const isCreatingNewThread = newMessage.parent == null;
        let createdThreadId: string | undefined;

        // Use override model if provided, otherwise fall back to selectedModel
        const modelToUse = newMessage.overrideModel || selectedModel;

        console.log(`DEBUG: useStreamMessage called`, {
            isCreatingNewThread,
            selectedModel: selectedModel?.name || 'none',
            overrideModel: newMessage.overrideModel?.name || 'none',
            modelToUse: modelToUse?.name || 'none',
            modelId: modelToUse?.id,
            hasParent: !!newMessage.parent,
            content: newMessage.content?.substring(0, 50) + '...'
        });

        if (modelToUse == null) {
            console.log(`DEBUG: useStreamMessage - No model available`);
            addSnackMessage({
                type: SnackMessageType.Brief,
                id: `missing-model${new Date().getTime()}`,
                message: 'You must select a model before submitting a prompt.',
            });
            return {};
        }

        const request: V4CreateMessageRequest = {
            model: modelToUse.id,
            host: modelToUse.host,
            ...newMessage,
            ...inferenceOpts,
        };

        // Remove the overrideModel from the request since it's not part of the API
        delete (request as any).overrideModel;

        console.log(`DEBUG: useStreamMessage - Making API request`, {
            model: request.model,
            host: request.host,
            hasParent: !!request.parent
        });

        try {
            const messageChunks = postMessageGenerator(request, abortController);

            // Process the streaming response
            let messageCount = 0;
            console.groupCollapsed('D$> RQ stream start');
            for await (const message of messageChunks) {
                messageCount++;
                if (messageCount % 10 === 1) console.log(`msg ${messageCount}`);
                if (isFirstMessage(message)) {
                    const parsedMessage = parseMessage(message);
                    
                    console.log(`DEBUG: useStreamMessage - First message created`, {
                        messageId: parsedMessage.id,
                        isCreatingNewThread
                    });

                    if (isCreatingNewThread) {
                        setSelectedThread(parsedMessage);
                        createdThreadId = parsedMessage.id;
                        
                        console.log(`DEBUG: useStreamMessage - New thread created`, {
                            threadId: createdThreadId
                        });
                    } else {
                        addChildToSelectedThread(parsedMessage);
                    }

                    // Store the message id that is being generated
                    let targetMessageList;
                    if (parsedMessage.role === Role.User) {
                        targetMessageList = parsedMessage.children;
                    } else if (parsedMessage.role === Role.System) {
                        // system prompt message should only have 1 child
                        targetMessageList = parsedMessage.children?.[0].children;
                    }

                    const streamingMessage = targetMessageList?.find(
                        (message) => !message.final && message.content.length === 0
                    );

                    // TODO: Temp compatibility - remove when Zustand streaming state migrated (Step 3)
                    appContext.setState({ streamingMessageId: streamingMessage?.id });
                }

                if (isMessageChunk(message)) {
                    // TODO: Temp compatibility - remove when Zustand streaming state migrated (Step 3)
                    if (!appContext.getState().isUpdatingMessageContent) {
                        appContext.setState({ isUpdatingMessageContent: true });
                    }

                    addContentToMessage(message.message, message.content);
                }

                if (isFinalMessage(message)) {
                    const streamedResponseId = appContext.getState().streamingMessageId;

                    if (streamedResponseId == null) {
                        throw new Error(
                            'The streaming message ID was reset before streaming ended'
                        );
                    }

                    console.log(`DEBUG: useStreamMessage - Final message received`, {
                        messageId: streamedResponseId,
                        threadId: createdThreadId
                    });

                    handleFinalMessage(parseMessage(message), isCreatingNewThread);

                    if (isCorpusLinkEnabled) {
                        await getAttributionsForMessage(request.content, streamedResponseId);
                    }
                }
            }
        } catch (err) {
            console.groupEnd();
            console.log(`D$> RQ stream error:`, err instanceof Error ? err.message : 'unknown');

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

                    setMessageLimitReached(err.messageId, true);
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

        console.groupEnd();
        console.log(`D$> RQ stream end, threadId:`, createdThreadId || 'none');
        return { threadId: createdThreadId };
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

    const mutation = useMutation({
        mutationFn: streamMessage,
        onMutate: (variables) => {
            console.log('D$> RQ mutation start:', variables.overrideModel?.name || 'no-model');
            // TODO: Temp compatibility - remove when Zustand streaming state migrated (Step 3)
            appContext.setState({ 
                streamPromptState: RemoteState.Loading,
                abortController: new AbortController() // This will be used by existing abort logic
            });
        },
        onSuccess: (result) => {
            console.log('D$> RQ success, threadId:', result?.threadId || 'none');
            // TODO: Temp compatibility - remove when Zustand streaming state migrated (Step 3)
            appContext.setState({ 
                streamPromptState: RemoteState.Loaded,
                abortController: null
            });
        },
        onError: (error) => {
            console.log('D$> RQ error:', error?.message || 'unknown');
            // TODO: Temp compatibility - remove when Zustand streaming state migrated (Step 3)
            appContext.setState({ 
                streamPromptState: RemoteState.Error,
                abortController: null
            });
        }
    });

    return mutation;
}; 