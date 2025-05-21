import type { LoaderFunction } from 'react-router-dom';

export const comparisonPageLoader = (): LoaderFunction => {
    return async () => {
        const isComparisonPageEnabled = process.env.IS_COMPARISON_PAGE_ENABLED === 'true';

        if (!isComparisonPageEnabled) {
            // React-router recommends throwing a response
            // eslint-disable-next-line @typescript-eslint/only-throw-error
            throw new Response('Not Found', { status: 404 });
        }

        return null;
    };
};
