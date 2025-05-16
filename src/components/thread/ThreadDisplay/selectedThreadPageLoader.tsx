import { defer, LoaderFunction } from 'react-router-dom';

import type { Model } from '@/api/playgroundApi/additionalTypes';
import { queryClient } from '@/api/query-client';
import { Role } from '@/api/Role';
import type { SelectedThreadMessage } from '@/api/SelectedThreadMessage';
import { appContext } from '@/AppContext';
import { getFeatureToggles } from '@/FeatureToggleContext';

import { getModelsQueryOptions, isModelVisible } from '../ModelSelect/useModels';

export const PARAM_SELECTED_MESSAGE = 'selectedMessage';

export const selectedThreadPageLoader: LoaderFunction = async ({ request, params }) => {
    const {
        getSelectedThread,
        selectedThreadRootId,
        getAttributionsForMessage,
        handleAttributionForChangingThread,
        setSelectedModel,
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

        const selectedThread = await getSelectedThread(params.id);
        const url = new URL(request.url);
        const selectedMessageId = url.searchParams.get(PARAM_SELECTED_MESSAGE);

        const { selectedThreadMessages, selectedThreadMessagesById } = appContext.getState();
        const lastResponseId = selectedThreadMessages
            .filter((messageId) => selectedThreadMessagesById[messageId].role === Role.LLM)
            .at(-1);

        if (lastResponseId != null) {
            const lastThreadContent = selectedThreadMessagesById[lastResponseId] as
                | SelectedThreadMessage
                | undefined;

            if (lastThreadContent) {
                const models = await modelsPromise;

                if (
                    lastThreadContent.model_id &&
                    models.some((model) => model.id === lastThreadContent.model_id)
                ) {
                    setSelectedModel(
                        models.find((model) => model.id === lastThreadContent.model_id) as Model
                    );
                } else {
                    const visibleModels = models.filter(isModelVisible);
                    setSelectedModel(visibleModels[0] as Model);
                }
                if (lastThreadContent.opts) {
                    updateInferenceOpts(lastThreadContent.opts);
                }
            }
        }

        if (isCorpusLinkEnabled) {
            let attributionsPromise;

            if (selectedMessageId != null) {
                const parentId = selectedThreadMessagesById[selectedMessageId].parent;
                const parentPrompt =
                    parentId != null ? selectedThreadMessagesById[parentId].content : '';

                attributionsPromise = getAttributionsForMessage(parentPrompt, selectedMessageId);
                selectMessage(selectedMessageId);
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
