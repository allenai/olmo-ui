import { render, screen } from '@test-utils';

import { UserResponseView } from '../ResponseView/UserResponseView';

test('UserResponseView', () => {
    render(<UserResponseView response="Hello! How are you?" msgId="testId" />);
    expect(screen.getByText('Hello! How are you?')).toBeVisible();
});
