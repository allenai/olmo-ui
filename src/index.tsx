import { LinearProgress } from '@mui/material';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { AppWrapper } from './components/AppWrapper';

const enableMocking = async () => {
    if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_MOCKING !== 'true') {
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
enableMocking().then(async () => {
    // We need to intiate the router in one place.
    // If we import it directly it starts fetching things before MSW has a chance to initialize.
    // Dynamically importing it gives us the best of both worlds here
    const { router } = await import('./router');

    root.render(
        <RouterProvider
            router={router}
            fallbackElement={
                <AppWrapper>
                    <LinearProgress />
                </AppWrapper>
            }
        />
    );
});
