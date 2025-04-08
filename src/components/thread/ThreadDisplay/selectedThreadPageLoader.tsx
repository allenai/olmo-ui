import { defer, LoaderFunction } from 'react-router-dom';

import { Role } from '@/api/Role';
import { appContext } from '@/AppContext';
import { getFeatureToggles } from '@/FeatureToggleContext';

export const PARAM_SELECTED_MESSAGE = 'selectedMessage';

export const selectedThreadPageLoader: LoaderFunction = async ({ request, params }) => {
    const {
        getSelectedThread,
        selectedThreadRootId,
        getAttributionsForMessage,
        handleAttributionForChangingThread,
        setSelectedModel,
        updateInferenceOpts,
        models,
        abortPrompt,
        selectMessage,
    } = appContext.getState();

    const { isCorpusLinkEnabled } = getFeatureToggles();

    // get the latest state of the selectedThread if we're changing to a different thread
    if (params.id != null && params.id !== selectedThreadRootId) {
        handleAttributionForChangingThread();
        // abort the current streaming prompt if there is any
        abortPrompt();

        const selectedThread = await getSelectedThread(params.id);
        const url = new URL(request.url);
        const selectedMessageId = url.searchParams.get(PARAM_SELECTED_MESSAGE);

        const { selectedThreadMessages, selectedThreadMessagesById } = appContext.getState();
        const lastResponseId = selectedThreadMessages
            .filter((messageId) => selectedThreadMessagesById[messageId].role === Role.LLM)
            .at(-1);

        if (lastResponseId != null) {
            const lastThreadContent = selectedThreadMessagesById[lastResponseId];
            const modelIdList = models
                .filter((model) => model.model_type === 'chat' && !model.is_deprecated)
                .map((model) => model.id);
            if (lastThreadContent) {
                if (
                    lastThreadContent.model_id &&
                    modelIdList.includes(lastThreadContent.model_id)
                ) {
                    setSelectedModel(lastThreadContent.model_id);
                } else {
                    setSelectedModel(modelIdList[0]);
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
