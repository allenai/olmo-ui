import type { ReactParameters } from '@storybook/react';
import type { StorybookParameters } from 'storybook/internal/types';

import type { MockThreadViewParameters } from './withMockThreadView';
import type { MockReactQueryParameters } from './withReactQuery';

declare module '@storybook/react' {
    interface Parameters
        extends StorybookParameters,
            ReactParameters,
            MockReactQueryParameters,
            MockThreadViewParameters {}
}
