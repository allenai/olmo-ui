import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import {
    isFinalMessage,
    isFirstMessage,
    isMessageChunk,
    MessageStreamError,
    MessageStreamErrorReason,
    parseMessage,
    StreamBadRequestError,
    V4CreateMessageRequest,
} from '@/api/Message';
import { postMessageGenerator } from '@/api/postMessageGenerator';
import { Role } from '@/api/Role';
import { appContext, useAppContext } from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import { getFeatureToggles } from '@/FeatureToggleContext';
import {
    AlertMessageSeverity,
    errorToAlert,
    SnackMessage,
    SnackMessageType,
} from '@/slices/SnackMessageSlice';
import { StreamMessageRequest } from '@/slices/ThreadUpdateSlice';

import { StreamingKeys } from './streamingQueryKeys';

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
    duration?: number; // Add duration field for performance tracking
}

export interface StreamMessageContext {
    abortController: AbortController;
    streamingMessageId?: string;
    isUpdatingContent: boolean;
    isCreatingNewThread: boolean;
    modelId?: string; // Added to identify which model this context belongs to
}

// New interface for tracking state per model
export interface ModelStreamState {
    messageId?: string;
    threadId?: string;
    content: string;
    isStreaming: boolean;
    isComplete: boolean;
    error?: Error;
    abortController: AbortController;
}

const ABORT_ERROR_MESSAGE: SnackMessage = {
    type: SnackMessageType.Alert,
    id: `abort-message-${new Date().getTime()}`.toLowerCase(),
    title: 'Response was aborted',
    message: `You stopped OLMo from generating answers to your query`,
    severity: AlertMessageSeverity.Warning,
} as const;

// Creates a query key for a specific model stream
// TODO: Temp - Will be removed when all direct StreamingKeys usage is in place
const getModelStreamKey = (modelId: string, requestId: string) =>
    StreamingKeys.models.stream(modelId, requestId);

export const useStreamMessage = () => {
    const queryClient = useQueryClient();
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
    const safelyAddContentToMessage = (messageId: string, content: string, modelId?: string) => {
        if (!messageId) {
            console.log('DEBUG: Cannot add content - missing messageId');
            return;
        }

        try {
            // Check if message exists in state before attempting to update
            const state = appContext.getState();
            const messageExists = state.selectedThreadMessagesById[messageId];

            if (!messageExists) {
                console.log(
                    `DEBUG: Message ${messageId} not found in state, skipping content update`
                );
                return;
            }

            // Update the message content
            addContentToMessage(messageId, content);

            // If we have a modelId, also update the query cache for this stream
            if (modelId) {
                // Generate a unique request ID based on messageId
                const requestId = messageId.split('_')[1] || messageId;

                // Update the stream state in the query cache
                queryClient.setQueryData(
                    StreamingKeys.models.stream(modelId, requestId),
                    (oldData: ModelStreamState | undefined) => ({
                        ...(oldData || { content: '', isStreaming: true, isComplete: false }),
                        content: (oldData?.content || '') + content,
                        messageId,
                    })
                );
            }
        } catch (error) {
            console.error(`DEBUG: Error adding content to message ${messageId}:`, error);
            // Continue execution despite error
        }
    };

    const handleFirstMessageReceived = (
        message: any,
        context: StreamMessageContext,
        result: StreamMessageResult
    ) => {
        const parsedMessage = parseMessage(message);

        console.log(`DEBUG: First message created`, {
            messageId: parsedMessage.id,
            isCreatingNewThread: context.isCreatingNewThread,
            modelId: context.modelId,
        });

        if (context.isCreatingNewThread) {
            setSelectedThread(parsedMessage);
            result.threadId = parsedMessage.id;
            result.isFirstThreadMessage = true;

            console.log(`DEBUG: New thread created`, {
                threadId: result.threadId,
                modelId: context.modelId,
            });
        } else {
            addChildToSelectedThread(parsedMessage);

            // Store parent thread ID for follow-up messages
            result.threadId = parsedMessage.root;
            console.log(`DEBUG: Added child to existing thread`, {
                messageId: parsedMessage.id,
                parentId: parsedMessage.parent,
                rootThreadId: parsedMessage.root,
                modelId: context.modelId,
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

            // If we have a modelId, update the query cache for this stream
            if (context.modelId) {
                // Generate a unique request ID based on message ID
                const requestId = streamingMessage.id.split('_')[1] || streamingMessage.id;

                // Initialize or update the stream state in the query cache
                queryClient.setQueryData(
                    StreamingKeys.models.stream(context.modelId, requestId),
                    (oldData: ModelStreamState | undefined) => ({
                        ...(oldData || {
                            content: '',
                            isStreaming: true,
                            isComplete: false,
                            abortController: context.abortController,
                        }),
                        messageId: streamingMessage.id,
                        threadId: result.threadId,
                    })
                );
            }

            // TODO: Temp compatibility - remove when Zustand streaming state is fully migrated
            // Only set the global streaming message ID for the first model in multi-model
            // or for single-model case
            if (!appContext.getState().streamingMessageId) {
                appContext.setState({ streamingMessageId: streamingMessage.id });
            }
        } else {
            console.log('DEBUG: Could not find streaming message ID in first message');
        }
    };

    const handleMessageChunkReceived = (
        message: any,
        context: StreamMessageContext,
        result: StreamMessageResult
    ) => {
        // TODO: Temp compatibility - remove when Zustand streaming state is fully migrated
        if (!appContext.getState().isUpdatingMessageContent) {
            appContext.setState({ isUpdatingMessageContent: true });
            context.isUpdatingContent = true;
        }

        safelyAddContentToMessage(message.message, message.content, context.modelId);

        // Update the content in our result for potential use by caller
        if (result.content === undefined) result.content = '';
        result.content += message.content;
    };

    // Extracted function to handle final message
    const handleFinalMessageReceived = async (
        message: any,
        context: StreamMessageContext,
        result: StreamMessageResult,
        request: V4CreateMessageRequest
    ) => {
        const { isCorpusLinkEnabled } = getFeatureToggles();

        // Verify we have a streaming message ID
        if (!context.streamingMessageId) {
            const error = new Error('The streaming message ID was not set before streaming ended');
            console.error(error);
            throw error;
        }

        console.log(`DEBUG: Final message received`, {
            messageId: context.streamingMessageId,
            threadId: result.threadId,
            modelId: context.modelId,
        });

        // Process the final message
        const parsedFinalMessage = parseMessage(message);
        handleFinalMessage(parsedFinalMessage, context.isCreatingNewThread);

        // If we have a modelId, update the query cache to mark this stream as complete
        if (context.modelId && result.threadId) {
            // Generate a unique request ID based on message ID
            const requestId =
                context.streamingMessageId.split('_')[1] || context.streamingMessageId;

            // Mark the stream as complete
            queryClient.setQueryData(
                StreamingKeys.models.stream(context.modelId, requestId),
                (oldData: ModelStreamState | undefined) => ({
                    ...(oldData || { content: result.content || '' }),
                    isStreaming: false,
                    isComplete: true,
                    threadId: result.threadId,
                })
            );
        }

        // Get attributions if enabled
        if (isCorpusLinkEnabled && context.streamingMessageId) {
            try {
                // Ensure the request has a valid model field
                if (!request.model) {
                    console.log('DEBUG: Skipping attributions - missing model in request');
                    return;
                }

                await getAttributionsForMessage(request.content, context.streamingMessageId);
            } catch (error) {
                // Log but don't throw - attributions are non-critical
                console.log('DEBUG: Error fetching attributions:', error);
            }
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
        console.groupCollapsed(
            `D$> RQ stream start${context.modelId ? ` (${context.modelId})` : ''}`
        );

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
            console.log(
                `D$> RQ stream end, threadId:${result.threadId || 'none'}${context.modelId ? `, modelId:${context.modelId}` : ''}`
            );
        } catch (error) {
            console.groupEnd();
            console.log(
                `D$> RQ stream error:${error instanceof Error ? error.message : 'unknown'}${context.modelId ? `, modelId:${context.modelId}` : ''}`
            );

            // If we have a modelId, update the query cache to mark this stream as failed
            if (context.modelId) {
                // Generate a unique request ID based on messageId or a fallback
                const requestId =
                    context.streamingMessageId?.split('_')[1] ||
                    result.messageId?.split('_')[1] ||
                    `error-${new Date().getTime()}`;

                // Mark the stream as failed
                queryClient.setQueryData(
                    StreamingKeys.models.stream(context.modelId, requestId),
                    (oldData: ModelStreamState | undefined) => ({
                        ...(oldData || { content: result.content || '' }),
                        isStreaming: false,
                        isComplete: false,
                        error: error instanceof Error ? error : new Error(String(error)),
                    })
                );
            }

            throw error;
        }
    };

    // Process a single model stream
    // TODO: Temp - Will be fully replaced by the parallel multi-model approach
    const streamSingleModel = useCallback(
        async (variables: StreamMessageVariables): Promise<StreamMessageResult> => {
            // Initialize result and context
            const result: StreamMessageResult = {};
            const context: StreamMessageContext = {
                abortController: new AbortController(),
                isUpdatingContent: false,
                isCreatingNewThread: variables.parent == null,
            };

            // TODO: Temp - Will use models array directly when model selection is unified
            // Use override model if provided, otherwise fall back to selectedModel
            const modelToUse = variables.overrideModel || selectedModel;

            // If we have a modelId, add it to the context
            if (modelToUse?.id) {
                context.modelId = modelToUse.id;
            }

            console.log(`DEBUG: useStreamMessage (single model) called`, {
                isCreatingNewThread: context.isCreatingNewThread,
                selectedModel: selectedModel?.name || 'none',
                overrideModel: variables.overrideModel?.name || 'none',
                modelToUse: modelToUse?.name || 'none',
                modelId: modelToUse?.id,
                hasParent: !!variables.parent,
                content: variables.content.substring(0, 50) + '...',
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
                hasParent: !!request.parent,
            });

            // Process the stream
            try {
                await processMessageStream(request, context, result);
                return result;
            } catch (err) {
                console.log(`DEBUG: Error in streamSingleModel:`, err);

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

                // Store the error in the result so it can be handled by the caller
                result.error = err instanceof Error ? err : new Error(String(err));

                addSnackMessage(snackMessage);
                throw err;
            }
        },
        [
            selectedModel,
            inferenceOpts,
            addContentToMessage,
            addChildToSelectedThread,
            addSnackMessage,
            setSelectedThread,
            setMessageLimitReached,
            getAttributionsForMessage,
            handleFinalMessage,
            queryClient,
        ]
    );

    // Process multiple models in parallel
    // Implementation for handling multiple model streams concurrently with independent state tracking
    const streamMultipleModels = useCallback(
        async (variables: StreamMessageVariables): Promise<StreamMessageResult> => {
            const models = variables.models || [];
            const modelResults: SingleModelResult[] = [];
            const threadIds: string[] = [];
            const messageIds: string[] = [];
            const errors: Error[] = [];

            // Create a unique request ID for this batch of models
            const batchId = `batch-${Date.now()}`;
            const startTime = performance.now();

            // Create a map to track per-model state
            const modelStreamStates = new Map<string, ModelStreamState>();

            // Initialize state for all models
            models.forEach((model) => {
                const abortController = new AbortController();
                modelStreamStates.set(model.id, {
                    content: '',
                    isStreaming: false,
                    isComplete: false,
                    abortController,
                });

                // Initialize query cache entry for this model
                queryClient.setQueryData(StreamingKeys.models.stream(model.id, batchId), {
                    content: '',
                    isStreaming: false,
                    isComplete: false,
                    abortController,
                });
            });

            // TODO: Temp compatibility - remove when Zustand streaming state is fully migrated
            appContext.setState({
                streamPromptState: RemoteState.Loading,
                abortController: new AbortController(),
            });

            // Process all models in parallel using Promise.allSettled
            const streamResults = await Promise.allSettled(
                models.map(async (model) => {
                    const modelStartTime = performance.now();

                    // Update model state to streaming
                    modelStreamStates.get(model.id)!.isStreaming = true;
                    queryClient.setQueryData(
                        StreamingKeys.models.stream(model.id, batchId),
                        (oldData: ModelStreamState) => ({
                            ...oldData,
                            isStreaming: true,
                        })
                    );

                    try {
                        // For follow-ups, get the last message ID for this specific thread
                        let parent = variables.parent;

                        if (model.rootThreadId) {
                            try {
                                // Dynamic import to avoid circular dependencies
                                const { getThread } = require('@/api/playgroundApi/thread');
                                const threadData = await getThread(model.rootThreadId);
                                const lastMessage =
                                    threadData.messages[threadData.messages.length - 1];
                                parent = lastMessage.id;
                            } catch (error) {
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
                                host: model.host,
                            },
                        };

                        try {
                            // Process this model - use the model's abort controller
                            const result = await streamSingleModel(singleModelRequest);

                            const modelDuration = (performance.now() - modelStartTime).toFixed(2);

                            // Update model state to complete
                            const modelState = modelStreamStates.get(model.id)!;
                            modelState.isStreaming = false;
                            modelState.isComplete = true;
                            modelState.threadId = result.threadId;
                            modelState.messageId = result.messageId;
                            modelState.content = result.content || '';

                            queryClient.setQueryData(
                                StreamingKeys.models.stream(model.id, batchId),
                                {
                                    ...modelState,
                                }
                            );

                            // Return the successful result
                            return {
                                threadId: result.threadId,
                                messageId: result.messageId,
                                content: result.content,
                                error: result.error,
                                limitReached: result.limitReached,
                                modelInfo: model,
                                duration: parseFloat(modelDuration),
                            } as SingleModelResult & { duration: number };
                        } catch (streamError) {
                            // If streamSingleModel threw an error, propagate it
                            throw streamError;
                        }
                    } catch (error) {
                        const modelDuration = (performance.now() - modelStartTime).toFixed(2);

                        // Update model state to error
                        const modelState = modelStreamStates.get(model.id)!;
                        const errorObj = error instanceof Error ? error : new Error(String(error));

                        modelState.isStreaming = false;
                        modelState.isComplete = false;
                        modelState.error = errorObj;

                        queryClient.setQueryData(StreamingKeys.models.stream(model.id, batchId), {
                            ...modelState,
                        });

                        // Check if this is an abort error and use the nicer abort message
                        if (error instanceof Error && error.name === 'AbortError') {
                            // Use the same abort message format as single model case
                            addSnackMessage(ABORT_ERROR_MESSAGE);
                        } else {
                            // For other errors, show model-specific error
                            addSnackMessage({
                                type: SnackMessageType.Brief,
                                id: `model-error-${model.id}-${Date.now()}`,
                                message: `Error streaming ${model.name}: ${errorObj.message}`,
                            });
                        }

                        // Return a result with the error, instead of throwing
                        // This allows for graceful partial failure handling
                        return {
                            error: errorObj,
                            modelInfo: model,
                            duration: parseFloat(modelDuration),
                        } as SingleModelResult & { duration: number };
                    }
                })
            );

            // Process results from all parallel streams
            let fastestStream = Infinity;
            let slowestStream = 0;
            let totalDuration = 0;
            let successfulStreams = 0;

            streamResults.forEach((result) => {
                if (result.status === 'fulfilled') {
                    // Handle successful stream (which might still contain an error)
                    const modelResult = result.value;
                    modelResults.push(modelResult);

                    // Count successful streams (those with a threadId)
                    if (modelResult.threadId) {
                        threadIds.push(modelResult.threadId);

                        // If this model had an error but still created a thread,
                        // we still consider it partially successful
                        if (!modelResult.error) {
                            successfulStreams++;
                        }
                    }

                    if (modelResult.messageId) {
                        messageIds.push(modelResult.messageId);
                    }

                    if (modelResult.error) {
                        errors.push(modelResult.error);
                    }

                    // Track performance metrics
                    if ('duration' in modelResult) {
                        const duration = modelResult.duration;
                        if (duration < fastestStream) fastestStream = duration;
                        if (duration > slowestStream) slowestStream = duration;
                        totalDuration += duration;
                    }
                } else {
                    // Handle rejected promise (should now be rare due to our error handling)
                    const error = result.reason;
                    const errorObj = error instanceof Error ? error : new Error(String(error));
                    errors.push(errorObj);

                    // Check if this is an abort error
                    if (errorObj instanceof Error && errorObj.name === 'AbortError') {
                        // Use the same abort message format as single model case
                        addSnackMessage(ABORT_ERROR_MESSAGE);
                    } else {
                        // Add a generic error message for unhandled rejections
                        addSnackMessage({
                            type: SnackMessageType.Brief,
                            id: `stream-error-${Date.now()}`,
                            message: `An unexpected error occurred: ${errorObj.message}`,
                        });
                    }
                }
            });

            // TODO: Temp compatibility - remove when Zustand streaming state is fully migrated
            appContext.setState({
                streamPromptState: RemoteState.Loaded,
                abortController: null,
                streamingMessageId: null, // Reset to enable form clearing for next submission
            });

            // Return aggregated results
            return {
                isMultiModel: true,
                threadIds,
                threadId: threadIds[0], // For backward compatibility
                messageIds,
                messageId: messageIds[0], // For backward compatibility
                errors: errors.length > 0 ? errors : undefined,
                modelResults,
            };
        },
        [streamSingleModel, addSnackMessage, queryClient]
    );

    // Main mutation function
    const streamMessage = useCallback(
        async (variables: StreamMessageVariables): Promise<StreamMessageResult> => {
            // Determine if this is a multi-model request
            const isMultiModel = !!variables.models && variables.models.length > 0;

            console.log(`DEBUG: Stream request received`, {
                isMultiModel,
                modelCount: isMultiModel ? variables.models!.length : 1,
            });

            // For multi-model case
            if (isMultiModel) {
                return streamMultipleModels(variables);
            }

            // TODO: Temp - Single model case for backward compatibility, will be unified later
            return streamSingleModel(variables);
        },
        [streamSingleModel, streamMultipleModels]
    );

    // Create the React Query mutation with proper typing
    const mutation = useMutation<StreamMessageResult, Error, StreamMessageVariables>({
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
                    abortController: new AbortController(), // This will be used by existing abort logic
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
                    abortController: null,
                    streamingMessageId: null, // Reset to enable form clearing for next submission
                });
            }
        },
        onError: (error) => {
            console.log('D$> RQ error:', error.message || 'unknown');

            // TODO: Temp compatibility - remove when Zustand streaming state is fully migrated
            appContext.setState({
                streamPromptState: RemoteState.Error,
                abortController: null,
                streamingMessageId: null, // Reset to enable form clearing for next submission
            });
        },
    });

    return mutation;
};
