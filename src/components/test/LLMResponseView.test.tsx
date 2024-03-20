import { render, screen } from '@test-utils';

import { LLMResponseView } from '../ResponseView/LLMResponseView';

test('LLMResponseView', () => {
    render(<LLMResponseView response="This is a response" msgId="testId" />);
    expect(screen.getByText('This is a response')).toBeVisible();
});
