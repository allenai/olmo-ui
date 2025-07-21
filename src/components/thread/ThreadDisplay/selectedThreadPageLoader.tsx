import { defer, LoaderFunction } from 'react-router-dom';

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
}

export const selectedThreadPageLoader: LoaderFunction = async ({ request, params }) => {
    const {
        getAttributionsForMessage,
        handleAttributionForChangingThread,
        abortPrompt,
        selectMessage,
    } = appContext.getState();

    if (params.id == null) {
        return null;
    }

    const loadedMessage = queryClient.getQueryData(threadOptions(params.id).queryKey);
    if (loadedMessage != null) {
        return null;
    }

    // get the latest state of the selectedThread if we're changing to a different thread
    handleAttributionForChangingThread();
    // abort the current streaming prompt if there is any
    abortPrompt();

    const modelsPromise = queryClient.ensureQueryData(getModelsQueryOptions);

    const threadRootId = params.id;
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
            // TODO: SingleThreadProvider has this filter logic. Seems like we shouldn't have it here too.
            const visibleModels = models.filter(isModelVisible);
            selectedModelId = visibleModels[0]?.id;
        }
    }

    const { isCorpusLinkEnabled } = getFeatureToggles();
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

        return defer({
            selectedThread,
            attributions: attributionsPromise,
            selectedModelId,
        });
    } else {
        return defer({
            selectedThread,
            selectedModelId,
        });
    }
};
