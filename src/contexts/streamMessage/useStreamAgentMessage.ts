import { useMutation } from '@tanstack/react-query';
import { useRef } from 'react';

import { type Agent } from '@/api/playgroundApi/additionalTypes';
import { playgroundApiClient } from '@/api/playgroundApi/playgroundApiClient';
import type { SchemaAgentChatRequest } from '@/api/playgroundApi/playgroundApiSchema';
import { Thread } from '@/api/playgroundApi/thread';
import { mapValueToFormData } from '@/utils/mapValueToFormData';

import {
    mapToRemoteState,
    type StreamCallbacks,
    type UseStreamMessage,
} from './streamMessageUtils';
import { useStreamTracking } from './useStreamTracking';

export interface AgentChatStreamMutationVariables {
    request: {
        content: string;
        captchaToken?: string | null;
        parent?: string;
        files?: FileList;
    };
    threadViewId: string;
    agent: Agent;
    thread?: Thread;
    bypassSafetyCheck: boolean;
}

export const AGENT_CHAT_STREAM_MUTATION_KEY = ['agent-stream'];

export const useStreamAgentMessage: UseStreamMessage<AgentChatStreamMutationVariables> = (
    callbacks?: StreamCallbacks
) => {
    const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

    const {
        activeStreams,
        abortAllStreams,
        completeStream,
        startStream,
        stopStream,
        prepareForNewSubmission,
        handleFirstMessage,
        handleErrors,
        hasReceivedFirstResponse,
    } = useStreamTracking(abortControllersRef, callbacks);

    // imperative
    const queryToThreadOrView = async ({
        request,
        threadViewId,
        agent,
        thread,
        bypassSafetyCheck,
    }: AgentChatStreamMutationVariables) => {
        startStream(threadViewId);

        // Create and store abort controller for this thread view
        const abortController = new AbortController();
        abortControllersRef.current.set(threadViewId, abortController);

        try {
            // do any request setup
            if (thread) {
                const lastMessageId = thread.messages.at(-1)?.id;
                request.parent = lastMessageId;
            }

            const { content, captchaToken, parent, files } = request;

            const result = await playgroundApiClient.POST('/v4/agents/chat', {
                parseAs: 'stream',
                body: {
                    content,
                    captchaToken,
                    files,
                    parent,
                    agentId: agent.id,
                    bypassSafetyCheck,
                },
                bodySerializer: (body) => {
                    const formData = new FormData();
                    for (const property in body) {
                        const value = body[property as keyof SchemaAgentChatRequest];
                        mapValueToFormData(formData, property, value);
                    }

                    return formData;
                },
                signal: abortController.signal, // Add abort signal to the request
            });

            // Our API endpoints aren't properly typed with error responses
            const resultError = result.error as unknown;
            if (resultError != null) {
                // Since we're using react-query with this we need to throw errors instead of returning them
                // Even though we told openapi-fetch to give us the raw response it parses the response if !response.ok
                handleErrors(resultError, result.response);
            }

            return { response: result.response, abortController };
        } catch (error) {
            // Clean up on error
            stopStream(threadViewId);
            throw error;
        }
    };

    const mutation = useMutation<
        { response: Response; abortController: AbortController },
        Error,
        AgentChatStreamMutationVariables
    >({
        mutationKey: AGENT_CHAT_STREAM_MUTATION_KEY,
        mutationFn: queryToThreadOrView,
        onMutate(variables) {
            startStream(variables.threadViewId);
        },
        onSuccess(_data, _variables) {
            // Stream is now active (not completed)
        },
        onSettled(_data, _error, _variables, _context) {
            // We might not need onComplete to be called in submission-process
        },
        onError(error, variables, _context) {
            stopStream(variables.threadViewId);
            callbacks?.onError?.(variables.threadViewId, error);
        },
    });

    return {
        // Original mutation interface
        ...mutation,

        // Operations
        abortAllStreams,
        completeStream,
        prepareForNewSubmission,

        // Callback to call on first message
        // This is currently necessary because stream processing is done externally
        onFirstMessage: handleFirstMessage,

        // State
        canPause: mutation.isPending || activeStreams.length > 0,
        activeStreamCount: activeStreams.length,
        hasReceivedFirstResponse,
        remoteState: mapToRemoteState(mutation.status, activeStreams),
    };
};
