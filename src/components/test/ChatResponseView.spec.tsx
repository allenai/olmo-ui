import { render, screen } from '@test-utils';

import { ChatResponseContainer } from '../ResponseView/ChatResponseContainer';

const setHover = (_value: boolean): void => {};
const Logo = () => <div>Logo</div>;

test('LLMResponseView', () => {
    render(
        <ChatResponseContainer setHover={setHover}>
            <Logo />
        </ChatResponseContainer>
    );
    expect(screen.getByText('Logo')).toBeVisible();
});
