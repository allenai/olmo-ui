import { type type PropsWithChildren, type type ReactNode, type UIEvent, useCallback } from 'react';

import { DEFAULT_FILE_UPLOAD_PROPS } from '@/components/thread/QueryForm/compareFileUploadProps';
import { useAgents } from '@/pages/agent/useAgents';

import { QueryContext, type QueryContextValue } from '../QueryContext';
import { useCanSubmitThread } from '../util/hooks/useCanSubmit';
import { useChatStreamMessage } from '../util/hooks/useChatStreamMessage';
import type { QueryFormValues } from '@/components/thread/QueryForm/QueryFormController';
import { useOnSingleChatSubmit } from '../util/hooks/useOnSingleChatSubmit';
const noOp = () => undefined;

interface AgentChatQueryContextProviderProps extends PropsWithChildren {
    agentId: string | undefined;
    threadId: string | undefined;
}

export const AgentChatQueryContextProvider = ({
    children,
    threadId,
    agentId,
}: AgentChatQueryContextProviderProps): ReactNode => {
    const canSubmit = useCanSubmitThread(threadId);

    const isNewThread = !threadId;

    const selectedAgent = useAgents({
        select: (agents) => {
            const selectedAgent = agents.find((agent) => agent.id === agentId);

            if (selectedAgent != null) {
                return selectedAgent;
            } else {
                return agents[0];
            }
        },
    });

    const placeholderText = `${isNewThread ? 'Start interacting with' : 'Follow up with'} ${selectedAgent.name}`;

    const streamMessage = useChatStreamMessage(threadId);

    const handleAbort = (e: UIEvent) => {
        e.preventDefault();
        streamMessage.abortAllStreams();
    };

    const submitToThreadView = () => {}

    const onSubmit = useOnSingleChatSubmit(streamMessage.prepareForNewSubmission, submitToThreadView)

    const contextValue: QueryContextValue = {
        threadStarted: Boolean(threadId),
        promptTemplate: undefined,
        canSubmit,
        autofocus: isNewThread,
        placeholderText,

        canPauseThread: streamMessage.canPause,
        remoteState: streamMessage.remoteState,
        fileUploadProps: {
            ...DEFAULT_FILE_UPLOAD_PROPS,
            isSendingPrompt: streamMessage.isPending,
            isFileUploadDisabled: true,
        },

        submitToThreadView,
        onSubmit,
        onAbort: handleAbort,

        setModelId: noOp,

        // TODO: Make sure this is valid with our API setup and the requirements for the agent
        isLimitReached: false,

        areFilesAllowed: false,

        canCallTools: false,
        isToolCallingEnabled: false,
        userToolDefinitions: undefined,
        availableTools: undefined,
        availableModels: [],

        onModelChange: noOp,
        getThreadViewModel: noOp,

        transform: () => [],

        inferenceConstraints: undefined,
        inferenceOpts: {},
        updateInferenceOpts: noOp,

        updateIsToolCallingEnabled: noOp,
        updateUserToolDefinitions: noOp,
        updateSelectedTools: noOp,

        selectedTools: [],

        extraParameters: undefined,
        setExtraParameters: noOp,
    };

    return <QueryContext.Provider value={contextValue}>{children}</QueryContext.Provider>;
};
