import { render, screen } from '@test-utils';

import { ChatResponseContainer } from '../ResponseView/ChatResponseContainer';

const setHover = (_value: boolean): void => {};
const Logo = () => <div>Logo</div>;

test('LLMResponseView', () => {
    render(<ChatResponseContainer children={<Logo />} setHover={setHover} />);
    expect(screen.getByText('Logo')).toBeVisible();
});
