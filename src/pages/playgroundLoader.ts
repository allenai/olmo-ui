import type { QueryClient } from '@tanstack/react-query';
import { LoaderFunction, ShouldRevalidateFunction } from 'react-router-dom';

import { threadOptions } from '@/api/playgroundApi/thread';
import { appContext } from '@/AppContext';
import { getModelsQueryOptions } from '@/components/thread/ModelSelect/useModels';
import { getPromptTemplatesQueryOptions } from '@/components/thread/promptTemplates/usePromptTemplates';
import { links } from '@/Links';
import { SnackMessageType } from '@/slices/SnackMessageSlice';
const MODEL_DEPRECATION_NOTICE_GIVEN_KEY = 'model-deprecation-notice-2025-06-10T22:00:00Z';
const MODEL_DEPRECATION_DATE = new Date('2025-06-10T22:00:00Z');

const createModelDeprecationNotice = () => {
    const modelsBeingDeprecated = ['Llama Tülu 3 405B'];

    return `We are reworking our model hosting system and will be removing the following model(s) on ${MODEL_DEPRECATION_DATE.toLocaleDateString()}: ${modelsBeingDeprecated.join(', ')}`;
};

export interface PlaygroundLoaderData {
    threadId?: string;
    modelId?: string;
    promptTemplateId?: string;
}

export const playgroundLoader =
    (queryClient: QueryClient): LoaderFunction =>
    async ({ params, request }): Promise<PlaygroundLoaderData> => {
        const { resetSelectedThreadState, resetAttribution } = appContext.getState();

        const searchParams = new URL(request.url).searchParams;

        const { id: threadId } = params;
        const promptTemplateId = !threadId ? searchParams.get('template') : null; // only apply to new threads
        const modelId = searchParams.get('model');

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        queryClient.prefetchQuery(getModelsQueryOptions);

        if (threadId === undefined) {
            resetSelectedThreadState();
            resetAttribution();
        }

        if (threadId) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            queryClient.prefetchQuery(threadOptions(threadId));
        }

        if (promptTemplateId) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            queryClient.prefetchQuery(getPromptTemplatesQueryOptions);
        }

        const hasModelDeprecationNoticeBeenGiven = localStorage.getItem(
            MODEL_DEPRECATION_NOTICE_GIVEN_KEY
        );

        if (!hasModelDeprecationNoticeBeenGiven && Date.now() < MODEL_DEPRECATION_DATE.getTime()) {
            const { addSnackMessage } = appContext.getState();
            addSnackMessage({
                id: MODEL_DEPRECATION_NOTICE_GIVEN_KEY,
                message: createModelDeprecationNotice(),
                type: SnackMessageType.Brief,
            });
            localStorage.setItem(MODEL_DEPRECATION_NOTICE_GIVEN_KEY, Date.now().toString());
        }

        const loaderData = {
            threadId,
            modelId: modelId ?? undefined,
            promptTemplateId: promptTemplateId ?? undefined,
        };

        return loaderData;
    };

export const handleRevalidation: ShouldRevalidateFunction = ({ nextUrl }) => {
    return nextUrl.pathname === links.playground;
};
