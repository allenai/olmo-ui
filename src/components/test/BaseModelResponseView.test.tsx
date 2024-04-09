import { render, screen } from '@test-utils';
import { debug } from 'vitest-preview';

import { BaseModelResponseView } from '../ResponseView/BaseModelResponseView';

test('LLMResponseView', () => {
    render(<BaseModelResponseView response="This is a response" msgId="testId" />);
    debug();
    expect(screen.getByText('This is a response')).toBeVisible();
});
