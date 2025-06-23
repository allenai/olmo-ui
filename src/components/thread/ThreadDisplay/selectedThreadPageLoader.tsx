import { defer, LoaderFunction } from 'react-router-dom';

import { RequestInferenceOpts } from '@/api/Message';
import type { Model } from '@/api/playgroundApi/additionalTypes';
import { threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
import { Role } from '@/api/Role';
import { appContext } from '@/AppContext';
import { getFeatureToggles } from '@/FeatureToggleContext';

import { getModelsQueryOptions, isModelVisible } from '../ModelSelect/useModels';

export const PARAM_SELECTED_MESSAGE = 'selectedMessage';

export const selectedThreadPageLoader: LoaderFunction = async ({ request, params }) => {
    const {
        selectedThreadRootId, // not used
        getAttributionsForMessage,
        handleAttributionForChangingThread,
        setSelectedCompareModels,
        updateInferenceOpts,
        abortPrompt,
        selectMessage,
    } = appContext.getState();

    const { isCorpusLinkEnabled } = getFeatureToggles();

    // get the latest state of the selectedThread if we're changing to a different thread
    if (params.id != null && params.id !== selectedThreadRootId) {
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

        if (lastResponse != null) {
            const models = await modelsPromise;

            if (lastResponse.modelId && models.some((model) => model.id === lastResponse.modelId)) {
                const model = models.find((model) => model.id === lastResponse.modelId) as Model;

                setSelectedCompareModels([
                    {
                        threadViewId: '0',
                        rootThreadId: threadRootId,
                        model,
                    },
                ]);
            } else {
                // TODO Temp: are "invisible" models actually getting to the UI?
                const visibleModels = models.filter(isModelVisible);

                setSelectedCompareModels([
                    {
                        threadViewId: '0',
                        rootThreadId: threadRootId,
                        model: visibleModels[0],
                    },
                ]);
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

            return defer({
                selectedThread,
                attributions: attributionsPromise,
            });
        } else {
            return defer({ selectedThread });
        }
    }

    return null;
};
