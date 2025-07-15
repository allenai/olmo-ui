import { defer, LoaderFunction } from 'react-router-dom';

import { RequestInferenceOpts } from '@/api/Message';
import { Thread, threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
import { Role } from '@/api/Role';
import { appContext } from '@/AppContext';
import { getFeatureToggles } from '@/FeatureToggleContext';

import { getModelsQueryOptions, isModelVisible } from '../ModelSelect/useModels';

export const PARAM_SELECTED_MESSAGE = 'selectedMessage';

export interface SelectedThreadLoaderData {
    selectedThread: Thread;
    attributions?: Promise<unknown>;
    selectedModelId?: string;
    threadId: string;
}

export const selectedThreadPageLoader: LoaderFunction = async ({ request, params }) => {
    const {
        selectedThreadRootId,
        getAttributionsForMessage,
        handleAttributionForChangingThread,
        updateInferenceOpts,
        abortPrompt,
        selectMessage,
    } = appContext.getState();

    const { isCorpusLinkEnabled } = getFeatureToggles();

    if (params.id == null) {
        throw new Error('Thread ID is required');
    }

    const threadRootId = params.id;

    // Handle thread change logic if needed
    if (threadRootId !== selectedThreadRootId) {
        handleAttributionForChangingThread();
        // abort the current streaming prompt if there is any
        abortPrompt();
    }

    const modelsPromise = queryClient.ensureQueryData(getModelsQueryOptions);

    const selectedThread = await queryClient.ensureQueryData(threadOptions(threadRootId));

    const url = new URL(request.url);
    const selectedMessageId = url.searchParams.get(PARAM_SELECTED_MESSAGE);

    const { messages: selectedThreadMessages } = selectedThread;

    const lastResponse = selectedThreadMessages.filter(({ role }) => role === Role.LLM).at(-1);

    let selectedModelId: string | undefined;

    if (lastResponse != null) {
        const models = await modelsPromise;

        if (lastResponse.modelId && models.some((model) => model.id === lastResponse.modelId)) {
            // Use the model from the thread's last response
            selectedModelId = lastResponse.modelId;
        } else {
            const visibleModels = models.filter(isModelVisible);
            selectedModelId = visibleModels[0]?.id;
        }

        // Update global model selection state
        const { setSelectedModel } = appContext.getState();
        const modelObj = models.find((m) => m.id === selectedModelId);
        if (modelObj) {
            setSelectedModel(modelObj);
        }

        // TODO (bb): this probably shouldn't be stored, and just queried from the last message
        updateInferenceOpts(lastResponse.opts as RequestInferenceOpts);
    }

    if (isCorpusLinkEnabled) {
        let attributionsPromise;

        const selectedMessage = selectedThreadMessages.find(
            (message) => message.id === selectedMessageId
        );

        if (selectedMessage != null) {
            const parentPrompt = selectedThreadMessages.find((message) =>
                message.children?.includes(selectedMessage.id)
            );

            attributionsPromise = getAttributionsForMessage(
                parentPrompt?.content || '',
                threadRootId,
                selectedMessage.id
            );

            selectMessage(threadRootId, selectedMessage.id);
        }

        const result = defer({
            selectedThread,
            attributions: attributionsPromise,
            selectedModelId,
            threadId: threadRootId,
        });
        return result;
    } else {
        const result = defer({
            selectedThread,
            selectedModelId,
            threadId: threadRootId,
        });
        return result;
    }
};
