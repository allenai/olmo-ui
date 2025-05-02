import { type LoaderFunction, redirect } from 'react-router-dom';

import { appContext } from '@/AppContext';
import { links } from '@/Links';

export const adminPageLoader: LoaderFunction = async ({ request }) => {
    const hasAdminPermission = appContext
        .getState()
        .userInfo?.permissions?.some((permission) => permission === 'write:model-config');

    const url = new URL(request.url);

    const isModelConfigEnabled = process.env.IS_MODEL_CONFIG_ENABLED === 'true';

    // Note: Github(#338) we need to check for user permission
    // before we allow the redirection to the page.
    // since we dont have any page for the admin page and if the
    // flag is not enabled we need to redirect to the home page.
    if (!isModelConfigEnabled || !hasAdminPermission) {
        // React-router recommends throwing a response
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw new Response('Not Found', { status: 404 });
    }

    if (url.pathname === links.admin) {
        return redirect(links.modelConfiguration);
    }

    return null;
};
