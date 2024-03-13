import { render, screen } from '@test-utils';

import { OlmoBanner } from '../OlmoBanner';

const Logo = () => <div>Logo</div>;

test('OlmoBanner', () => {
    render(<OlmoBanner bannerLogo={<Logo />} />);
    expect(screen.getByText('Logo')).toBeVisible();
});
