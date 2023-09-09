import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Content, Footer } from '@allenai/varnish2/components';
import { LinkProps, Route, Routes } from 'react-router-dom';
import { Button, ButtonProps, Grid, LinearProgress, Typography } from '@mui/material';

import { Home } from './pages/Home';
import { Thread } from './pages/Thread';
import { Admin } from './pages/Admin';
import { useAppContext } from './AppContext';
import { OlmoBanner } from './components/OlmoBanner';
import { GlobalAlertList } from './components/GlobalAlertList';
import { WallpaperCircle } from './components/WallpaperCircle';
import { PromptTemplates } from './pages/PromptTemplates';
import { olmoTheme } from './olmoTheme';
import { useFeatureToggles } from './FeatureToggleContext';

export interface AppRoute {
    path: string;
    Component: () => JSX.Element;
}

interface HeaderEndSlotProps {
    client?: string;
}

const FeedbackButton = () => {
    return (
        <BannerButton
            rel="noopener noreferrer"
            target="_blank"
            to={feedbackFormUrl}
            href={feedbackFormUrl}
            variant="outlined">
            Feedback
        </BannerButton>
    );
};

const feedbackFormUrl =
    'https://docs.google.com/forms/d/e/1FAIpQLSfmPUnxBss08X8aq7Aiy17YSPhH-OqHzHMIzXg4zsIhAbvqxg/viewform?usp=sf_link';

const HeaderEndSlot = ({ client }: HeaderEndSlotProps) => {
    return (
        <>
            <Grid container justifyContent="space-between" spacing={2}>
                <Grid item>
                    {client && (
                        <span>
                            <WhiteTypography>{client}</WhiteTypography>
                        </span>
                    )}
                </Grid>
                <Grid item>
                    <FeedbackButton />
                </Grid>
            </Grid>
        </>
    );
};

const ROUTES: AppRoute[] = [
    {
        path: '/',
        Component: Home,
    },
    {
        path: '/thread/:id',
        Component: Thread,
    },
    {
        path: '/prompt-templates',
        Component: PromptTemplates,
    },
    {
        path: '/admin',
        Component: Admin,
    },
];

export const App = () => {
    const { userInfo, getUserInfo, schema, getSchema } = useAppContext();
    const toggles = useFeatureToggles();

    useEffect(() => {
        getUserInfo().then(getSchema);

        if (toggles.logToggles) {
            console.log(toggles);
        }
    }, []);

    const hasUserData = !userInfo.loading && !userInfo.error && userInfo.data;
    const hasSchema = !schema.loading && !schema.error && schema.data;
    const isLoading = userInfo.loading || schema.loading;

    return (
        <OuterContainer>
            <AbsoluteContainer>
                <WallpaperCircle color={olmoTheme.color2.N8.hex} />
            </AbsoluteContainer>
            <RelativeContainer>
                <OlmoBanner
                    transparentBackground={true}
                    endSlot={<HeaderEndSlot client={userInfo.data?.client} />}
                />
                <DisclaimerDiv>
                    This demo is currently using{' '}
                    <a href="https://huggingface.co/meta-llama/Llama-2-70b-chat-hf">LLaMa2 (70B Chat)</a>.
                    It'll be updated to use the 70B parameter OLMo model.
                </DisclaimerDiv>
                <Content bgcolor="transparent" main>
                    <GlobalAlertList />
                    {isLoading ? <LinearProgress /> : null}
                    {hasUserData && hasSchema ? (
                        <Routes>
                            {ROUTES.map(({ path, Component }) => (
                                <Route key={path} path={path} element={<Component />} />
                            ))}
                        </Routes>
                    ) : null}
                </Content>
                <BottomBanner>
                    <OlmoBanner transparentBackground={false} endSlot={<FeedbackButton />} />
                </BottomBanner>
                <OlmoFooter />
            </RelativeContainer>
        </OuterContainer>
    );
};

const DisclaimerDiv = styled.div`
    background-color: transparent;
    color: ${({ theme }) => theme.color2.N3};
    margin-left: ${({ theme }) => theme.spacing(3)};
    margin-top: 0;
    a {
        color: white;
    }
`;

const WhiteTypography = styled(Typography)`
    padding-top: ${({ theme }) => theme.spacing(1)};
    color: white;
`;

const AbsoluteContainer = styled.div`
    position: absolute;
    z-index: 5;
`;

const RelativeContainer = styled.div`
    position: relative;
    z-index: 10;
    min-height: 100vh;
`;

const OlmoFooter = styled(Footer)`
    &&&&& {
        color: white;
        background-color: transparent;
        padding-top: 0px;
    }
    a {
        color: white;
    }
`;

const BottomBanner = styled.div`
    margin: ${({ theme }) => theme.spacing(2)};
`;

const OuterContainer = styled.div`
    position: relative;
    overflow: hidden;
    background: ${({ theme }) =>
        `linear-gradient(122deg, ${theme.color2.N7} 0%, transparent 100%), ${theme.color2.N8}`};
`;

const BannerButton = styled(Button)<ButtonProps & LinkProps>`
    && {
        color: white;
        border-color: white;
        margin: ${({ theme }) => theme.spacing(0.5)};
    }
    &&:hover {
        border-color: white;
    }
`;
