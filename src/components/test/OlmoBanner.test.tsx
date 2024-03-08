import React from 'react';
import { test } from 'vitest';

import { render, screen } from '../../utils/test-utils';

import { OlmoBanner } from '../OlmoBanner';

const Logo = () => <div>Logo</div>;

test('OlmoBanner', () => {
    render(<OlmoBanner bannerLogo={<Logo />} />);
    screen.getByText('Logo');
});
