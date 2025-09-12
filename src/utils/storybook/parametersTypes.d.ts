import type { ReactParameters } from '@storybook/react-vite';
import type { StorybookParameters } from 'storybook/internal/types';

import type { MockThreadViewParameters } from './withMockThreadView';
import type { MockReactQueryParameters } from './withReactQuery';

declare module '@storybook/react-vite' {
    interface Parameters
        extends StorybookParameters,
            ReactParameters,
            MockReactQueryParameters,
            MockThreadViewParameters {}
}
