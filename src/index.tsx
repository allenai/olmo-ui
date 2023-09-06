import React from 'react';
import ReactDOM from 'react-dom';
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

ReactDOM.render(<VarnishedApp />, document.getElementById('root'));
