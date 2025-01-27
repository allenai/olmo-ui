import { defer, LoaderFunction } from 'react-router-dom';

import { Role } from '@/api/Role';
import { appContext } from '@/AppContext';

import { ATTRIBUTION_DRAWER_ID } from '../attribution/drawer/AttributionDrawer';

export const selectedThreadPageLoader: LoaderFunction = async ({ params }) => {
    const {
        currentOpenDrawer,
        getSelectedThread,
        selectedThreadRootId,
        getAttributionsForMessage,
        selectMessage,
        handleAttributionForChangingThread,
        setSelectedModel,
        updateInferenceOpts,
        models,
        abortPrompt,
    } = appContext.getState();

    // get the latest state of the selectedThread if we're changing to a different thread
    if (params.id != null && params.id !== selectedThreadRootId) {
        handleAttributionForChangingThread();
        // abort the current streaming prompt if there is any
        abortPrompt();

        const selectedThread = await getSelectedThread(params.id);

        const { selectedThreadMessages, selectedThreadMessagesById } = appContext.getState();
        const lastPromptId = selectedThreadMessages
            .filter((messageId) => selectedThreadMessagesById[messageId].role === Role.User)
            .at(-1);
        const lastPrompt =
            lastPromptId != null ? selectedThreadMessagesById[lastPromptId].content : '';
        const lastResponseId = selectedThreadMessages
            .filter((messageId) => selectedThreadMessagesById[messageId].role === Role.LLM)
            .at(-1);

        if (lastResponseId != null) {
            if (currentOpenDrawer === ATTRIBUTION_DRAWER_ID) {
                // this doesn't happen because we never have the drawer open -- its either a page load
                // or the history drawer was open
                selectMessage(lastResponseId);
            }
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

        const attributionsPromise =
            lastResponseId != null
                ? getAttributionsForMessage(lastPrompt, lastResponseId)
                : undefined;

        return defer({
            selectedThread,
            attributions: attributionsPromise,
        });
    }

    return null;
};
