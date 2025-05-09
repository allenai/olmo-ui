import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunction } from 'react-router-dom';
import { redirect } from 'react-router-dom';

import { getUserModel } from '@/api/getWhoAmIModel';
import { links } from '@/Links';

export const adminPageLoader = (queryClient: QueryClient): LoaderFunction => {
    return async ({ request }) => {
        const data = await queryClient.ensureQueryData(getUserModel);
        const hasAdminPermission = data.permissions?.includes('write:model-config');
        const isModelConfigEnabled = process.env.IS_MODEL_CONFIG_ENABLED === 'true';

        if (!isModelConfigEnabled || !hasAdminPermission) {
            // React-router recommends throwing a response
            // eslint-disable-next-line @typescript-eslint/only-throw-error
            throw new Response('Not Found', { status: 404 });
        }

        const url = new URL(request.url);
        if (url.pathname === links.admin) {
            return redirect(links.modelConfiguration);
        }

        return null;
    };
};
