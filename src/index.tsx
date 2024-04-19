import { LinearProgress } from '@mui/material';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { router } from './router';
import { VarnishedApp } from './components/VarnishedApp';

const enableMocking = async () => {
    if (process.env.NODE_ENV !== 'development' || process.env.ENABLE_MOCKING !== 'true') {
        return;
    }

    const { worker } = await import('./mocks/browser');

    return worker.start();
};

const container = document.getElementById('root');
if (!container) {
    throw new Error("No element with an id of 'root' was found.");
}
const root = createRoot(container);
enableMocking().then(() => {
    root.render(
        <RouterProvider
            router={router}
            fallbackElement={
                <VarnishedApp>
                    <LinearProgress />
                </VarnishedApp>
            }
        />
    );
});
