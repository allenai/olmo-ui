import { useReCaptcha } from '@wojtekmaj/react-recaptcha-v3';
import { type PropsWithChildren, type ReactNode, type UIEvent, useState } from 'react';

import { useAppContext } from '@/AppContext';
import { DEFAULT_FILE_UPLOAD_PROPS } from '@/components/thread/QueryForm/compareFileUploadProps';
import type { QueryFormValues } from '@/components/thread/QueryForm/QueryFormController';
import { useAgents } from '@/pages/agent/useAgents';

import { QueryContext, type QueryContextValue } from '../QueryContext';
import { processSingleAgentSubmission } from '../submission-process';
import { useCanSubmitThread } from '../util/hooks/useCanSubmit';
import { useAgentChatStreamMessage } from '../util/hooks/useChatStreamMessage';
import { useOnSingleChatSubmit } from '../util/hooks/useOnSingleChatSubmit';
import { useSetShareableForSingleThread } from '../util/hooks/useSetShareableForSingleThread';
const noOp = () => undefined;

interface AgentChatQueryContextProviderProps extends PropsWithChildren {
    agentId: string | undefined;
    threadId: string | undefined;
}

export const AgentChatProvider = ({
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

    const streamMessage = useAgentChatStreamMessage(threadId, selectedAgent);

    const handleAbort = (e: UIEvent) => {
        e.preventDefault();
        streamMessage.abortAllStreams();
    };

    const [bypassSafetyCheck, setBypassSafetyCheck] = useState(false);

    const { executeRecaptcha } = useReCaptcha();
    const addSnackMessage = useAppContext((state) => state.addSnackMessage);

    useSetShareableForSingleThread(threadId);

    const submitToThreadView = async (threadViewId: string, data: QueryFormValues) => {
        return processSingleAgentSubmission({
            data,
            agent: selectedAgent,
            rootThreadId: threadId,
            threadViewId,
            bypassSafetyCheck,
            streamMutateAsync: streamMessage.mutateAsync,
            executeRecaptcha,
            onFirstMessage: streamMessage.onFirstMessage,
            onCompleteStream: streamMessage.completeStream,
            addSnackMessage,
        });
    };

    const onSubmit = useOnSingleChatSubmit(
        streamMessage.prepareForNewSubmission,
        submitToThreadView
    );

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

        bypassSafetyCheck,
        updateBypassSafetyCheck: setBypassSafetyCheck,

        selectedTools: [],

        extraParameters: undefined,
        setExtraParameters: noOp,
    };

    return <QueryContext.Provider value={contextValue}>{children}</QueryContext.Provider>;
};
