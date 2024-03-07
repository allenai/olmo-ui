import { render, screen } from '@testing-library/react';
import React from 'react';

import { OlmoBanner } from '../OlmoBanner';

const Logo = () =>  <div>Logo</div>

describe('OlmoBanner', () => {
    it('should contains the heading 1', () => {
        render(<OlmoBanner bannerLogo={<Logo />}/>);
        screen.getByText("Logo");
    });
});
