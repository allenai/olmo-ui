import { defer, LoaderFunction } from 'react-router-dom';

import { Role } from '@/api/Role';
import { appContext } from '@/AppContext';

export const selectedThreadPageLoader: LoaderFunction = async ({ params }) => {
    const {
        getSelectedThread,
        selectedThreadRootId,
        getAttributionsForMessage,
        selectMessage,
        handleAttributionForChangingThread,
        setSelectedModel,
        updateInferenceOpts,
        models,
    } = appContext.getState();

    // get the latest state of the selectedThread if we're changing to a different thread
    if (params.id != null && params.id !== selectedThreadRootId) {
        handleAttributionForChangingThread();

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
            selectMessage(lastResponseId);
            const lastThreadContent = selectedThreadMessagesById[lastResponseId];
            const modelIdList = models.map((model) => model.id);
            if (lastThreadContent) {
                if (
                    lastThreadContent.model_id &&
                    modelIdList.includes(lastThreadContent.model_id)
                ) {
                    setSelectedModel(lastThreadContent.model_id);
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
