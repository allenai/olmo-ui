import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { VarnishApp } from '@allenai/varnish2/components';
import { createGlobalStyle } from 'styled-components';

import { App } from './App';
import { ScrollToTopOnPageChange } from './components/ScrollToTopOnPageChange';
import { olmoTheme } from './olmoTheme';
import { FeatureToggleProvider } from './FeatureToggleContext';

const GlobalStyle = createGlobalStyle`
  html {
    background: ${({ theme }: { theme: typeof olmoTheme }) => theme.color2.N9.hex};
  }
`;

const VarnishedApp = () => (
    <BrowserRouter>
        <FeatureToggleProvider>
            <ScrollToTopOnPageChange />
            <VarnishApp layout="left-aligned" theme={olmoTheme}>
                <GlobalStyle />
                <App />
            </VarnishApp>
        </FeatureToggleProvider>
    </BrowserRouter>
);

const container = document.getElementById('root');
if (!container) {
    throw new Error("No element with an id of 'root' was found.");
}
const root = createRoot(container);
root.render(<VarnishedApp />);
