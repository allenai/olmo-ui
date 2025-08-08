import { defer, LoaderFunction, redirect } from 'react-router-dom';

import { error } from '@/api/error';
import { Thread, threadOptions } from '@/api/playgroundApi/thread';
import { queryClient } from '@/api/query-client';
import { Role } from '@/api/Role';
import { appContext } from '@/AppContext';
import { selectModelIdForThread } from '@/contexts/modelSelectionUtils';
import { getFeatureToggles } from '@/FeatureToggleContext';
import { links } from '@/Links';
import { AlertMessageSeverity, SnackMessageType } from '@/slices/SnackMessageSlice';

import { getModelsQueryOptions } from '../ModelSelect/useModels';

export const PARAM_SELECTED_MESSAGE = 'selectedMessage';

export interface SelectedThreadLoaderData {
    selectedThread: Thread;
    attributions?: Promise<unknown>;
    selectedModelId?: string;
}

const handleThreadLoadError = (caughtError: unknown, threadId: string): never => {
    const { addSnackMessage } = appContext.getState();

    if (error.isOpenApiQueryErrorPayload(caughtError) && caughtError.error.code === 404) {
        addSnackMessage({
            id: `thread-not-found-${new Date().getTime()}`.toLowerCase(),
            type: SnackMessageType.Alert,
            title: `Error getting message ${threadId}.`,
            message:
                'The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again. (HTTPError)',
            severity: AlertMessageSeverity.Error,
        });
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw redirect(links.playground);
    }

    // Only re-throws unhandled errors
    throw caughtError;
};

export const selectedThreadPageLoader: LoaderFunction = async ({ request, params }) => {
    const { getAttributionsForMessage, handleAttributionForChangingThread, selectMessage } =
        appContext.getState();

    if (params.id == null) {
        return null;
    }

    const loadedMessage = queryClient.getQueryData(threadOptions(params.id).queryKey);
    if (loadedMessage != null) {
        return null;
    }

    // get the latest state of the selectedThread if we're changing to a different thread
    handleAttributionForChangingThread();

    const modelsPromise = queryClient.ensureQueryData(getModelsQueryOptions);

    const threadRootId = params.id;

    const selectedThread: Thread = await queryClient
        .ensureQueryData(threadOptions(threadRootId))
        .catch((err: unknown) => {
            return handleThreadLoadError(err, threadRootId);
        });

    const url = new URL(request.url);
    const selectedMessageId = url.searchParams.get(PARAM_SELECTED_MESSAGE);

    const { messages: selectedThreadMessages } = selectedThread;

    const lastResponse = selectedThreadMessages.filter(({ role }) => role === Role.LLM).at(-1);

    let selectedModelId: string | undefined;

    if (lastResponse != null) {
        const models = await modelsPromise;
        selectedModelId = selectModelIdForThread(models, lastResponse);
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
