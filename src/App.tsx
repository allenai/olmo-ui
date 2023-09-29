import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BannerLink, Content, Footer, logos } from '@allenai/varnish2/components';
import { LinkProps, Link, Outlet } from 'react-router-dom';
import { Button, ButtonProps, Grid, CircularProgress, Typography } from '@mui/material';

import { useAppContext } from './AppContext';
import { OlmoBanner } from './components/OlmoBanner';
import { GlobalAlertList } from './components/GlobalAlertList';
import { WallpaperCircle } from './components/WallpaperCircle';
import { olmoTheme } from './olmoTheme';
import { useFeatureToggles } from './FeatureToggleContext';
import { OlmoLogo } from './components/logos/OlmoLogo';

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
            component={Link}
            rel="noopener noreferrer"
            target="_blank"
            to={feedbackFormUrl}
            href={feedbackFormUrl}
            variant="outlined">
            Feedback
        </BannerButton>
    );
};

const ExploreDataButton = () => {
    return (
        <BannerButton
            component={Link}
            rel="noopener noreferrer"
            to="/search"
            href="/search"
            variant="outlined">
            Explore Dataset
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
                    <ExploreDataButton />
                </Grid>
                <Grid item>
                    <FeedbackButton />
                </Grid>
            </Grid>
        </>
    );
};

export const App = () => {
    const { userInfo, getUserInfo, schema, getSchema } = useAppContext();
    const toggles = useFeatureToggles();

    const [isLoading, setLoading] = useState(true);

    // TODO: There's an edge case where these XHR requests fail that we're not handling now.
    // This is a temporary compromise to avoid "flashing" an error to users while they're
    // being taken to the login page.
    useEffect(() => {
        setLoading(true);
        getUserInfo()
            .then(getSchema)
            .finally(() => setLoading(false));
        if (toggles.logToggles) {
            console.log(toggles);
        }
    }, []);

    return (
        <OuterContainer>
            <AbsoluteContainer>
                <WallpaperCircle color={olmoTheme.color2.N8.hex} />
            </AbsoluteContainer>
            {isLoading ? (
                <LoadingContainer>
                    <CircularProgress sx={{ color: '#fff' }} />
                </LoadingContainer>
            ) : null}
            {!isLoading && userInfo.data && schema.data ? (
                <RelativeContainer>
                    <OlmoBanner
                        bannerLogo={
                            <BannerLink href="https://olmo.allen.ai">
                                <OlmoLogo />
                            </BannerLink>
                        }
                        transparentBackground={true}
                        endSlot={<HeaderEndSlot client={userInfo.data?.client} />}
                    />
                    <Disclaimer>
                        This site uses the Tulu2 model and allows you to search the{' '}
                        <a href="https://huggingface.co/datasets/allenai/dolma">Dolma dataset</a>.
                        We will eventually update this site to use the OLMo model.
                    </Disclaimer>
                    <Content bgcolor="transparent" main>
                        <GlobalAlertList />
                        <Outlet />
                    </Content>
                    <BottomBanner>
                        <OlmoBanner
                            bannerLogo={
                                <BannerLink href="https://allenai.org">
                                    <logos.AI2Logo color="white" size="md" />
                                </BannerLink>
                            }
                            transparentBackground={false}
                            endSlot={<FeedbackButton />}
                        />
                    </BottomBanner>
                    <OlmoFooter />
                </RelativeContainer>
            ) : null}
        </OuterContainer>
    );
};

const Disclaimer = styled.div`
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
    max-width: 1200px;
    margin: auto;
`;

const LoadingContainer = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
    z-index: 10;
    display: grid;
    align-items: center;
    justify-items: center;
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

// TODO: find a better way to capture the intended type; my brain isn't big enough to
// parse MUI's Button types
const BannerButton = styled(Button)<ButtonProps & { component: typeof Link } & LinkProps>`
    && {
        color: white;
        border-color: white;
        margin: ${({ theme }) => theme.spacing(0.5)};
    }
    &&:hover {
        border-color: white;
    }
`;
