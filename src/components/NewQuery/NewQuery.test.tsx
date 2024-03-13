import { render } from '@test-utils';

import { NewQuery } from '.';

describe('NewQuery', () => {
    test('should send a prompt', () => {
        render(<NewQuery />);
    });
});
