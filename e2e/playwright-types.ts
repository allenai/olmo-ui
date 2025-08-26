import type { NetworkFixture } from '@msw/playwright';

export interface Fixtures {
    network: NetworkFixture;
    isAnonymousTest: boolean;
}
