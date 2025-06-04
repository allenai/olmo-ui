import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunction } from 'react-router-dom';

import type { Model } from '@/api/playgroundApi/additionalTypes';
import { appContext } from '@/AppContext';
import { getModelsQueryOptions } from '@/components/thread/ModelSelect/useModels';

export const comparisonPageLoader = (queryClient: QueryClient): LoaderFunction => {
    return async ({ params, request }) => {
        const isComparisonPageEnabled = process.env.IS_COMPARISON_PAGE_ENABLED === 'true';

        if (!isComparisonPageEnabled) {
            // React-router recommends throwing a response
            // eslint-disable-next-line @typescript-eslint/only-throw-error
            throw new Response('Not Found', { status: 404 });
        }

        // from playgroundLoader.ts
        const { resetSelectedThreadState, resetAttribution, getSchema, schema, abortPrompt } =
            appContext.getState();

        const promises = [];

        // abort the current streaming prompt if there is any
        abortPrompt();

        const models = (await queryClient.ensureQueryData(getModelsQueryOptions)) as Model[];

        if (schema == null) {
            promises.push(getSchema());
        }

        // (always true on this page at the moment)
        // not relevent at the moment
        if (params.id === undefined) {
            resetSelectedThreadState();
            resetAttribution();
        }

        await Promise.all(promises);

        const { setSelectedCompareModels } = appContext.getState();
        const modelListString = new URL(request.url).searchParams.get('models');
        const modelListStrArray = modelListString?.split(',');

        // Set the models from the url params by default
        // the threads selected (if any) will override this.
        if (modelListStrArray) {
            const preselectedModels = modelListStrArray.map((modelId, idx) => {
                const modelObj = models.find((model) => model.id === modelId);
                // TODO: handle non existant passed models?
                // Also, see comment below about maybe smarter model selection (compat)
                return {
                    threadViewId: String(idx),
                    model: modelObj ?? models[0],
                };
            });

            setSelectedCompareModels(preselectedModels);
        } else {
            // TODO: just defaulting to model @ idx = 0
            // this could probably be smarter (the next compatibile model?)
            const defaultModels = [
                {
                    threadViewId: '0',
                    model: models[0],
                },
                {
                    threadViewId: '1',
                    model: models[0],
                },
            ];
            setSelectedCompareModels(defaultModels);
        }

        return null;
    };
};
