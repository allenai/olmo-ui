import { render, screen } from '@test-utils';

import { BaseModelResponseView } from '../ResponseView/BaseModelResponseView';

test('LLMResponseView', () => {
    render(<BaseModelResponseView response="This is a response" msgId="testId" />);
    expect(screen.getByText('This is a response')).toBeVisible();
});
