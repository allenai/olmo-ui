import { useEffect, useState } from 'react';
import { styled, Button, Grid, CircularProgress, Typography } from '@mui/material';
import { BannerLink, Content, Footer, logos } from '@allenai/varnish2/components';
import { LinkProps, Link, Outlet } from 'react-router-dom';

import { useAppContext } from './AppContext';
import { OlmoBanner } from './components/OlmoBanner';
import { GlobalAlertList } from './components/GlobalAlertList';
import { WallpaperCircle } from './components/WallpaperCircle';
import { olmoTheme } from './olmoTheme';
import { OlmoLogo } from './components/logos/OlmoLogo';
import { useTrackPageView } from './analytics/useTrackPageView';
import { links } from './Links';

export interface AppRoute {
    path: string;
    Component: () => JSX.Element;
}

interface HeaderEndSlotProps {
    client?: string;
}

interface HeaderButtonProps {
    url: string;
    label: string;
    openOnNewPage?: boolean;
}

const HeaderButton = ({ url, label }: HeaderButtonProps) => {
    return (
        <BannerButton
            component={Link}
            rel="noopener noreferrer"
            target="_blank"
            to={url}
            href={url}
            variant="outlined">
            {label}
        </BannerButton>
    );
};

const HeaderEndSlot = ({ client }: HeaderEndSlotProps) => {
    return (
        <>
            <Grid container justifyContent="space-between" spacing={2}>
                <Grid item>
                    {!!client && (
                        <span>
                            <WhiteTypography>{client}</WhiteTypography>
                        </span>
                    )}
                </Grid>
                <Grid item>
                    <HeaderButton url="https://dolma.allen.ai" label="Explore Dataset" />
                </Grid>
                <Grid item>
                    <HeaderButton openOnNewPage={true} url={links.feedbackForm} label="Feedback" />
                </Grid>
            </Grid>
        </>
    );
};

export const App = () => {
    useTrackPageView();
    const userInfo = useAppContext((state) => state.userInfo);
    const getUserInfo = useAppContext((state) => state.getUserInfo);
    const schema = useAppContext((state) => state.schema);
    const getSchema = useAppContext((state) => state.getSchema);

    const [isLoading, setLoading] = useState(true);

    // TODO: There's an edge case where these XHR requests fail that we're not handling now.
    // This is a temporary compromise to avoid "flashing" an error to users while they're
    // being taken to the login page.
    useEffect(() => {
        setLoading(true);
        getUserInfo()
            .then(getSchema)
            .finally(() => {
                setLoading(false);
            });
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
            {!isLoading && userInfo !== null && schema !== null ? (
                <RelativeContainer>
                    <OlmoBanner
                        bannerLogo={
                            <BannerLink href="https://olmo.allen.ai">
                                <OlmoLogo />
                            </BannerLink>
                        }
                        transparentBackground={true}
                        endSlot={<HeaderEndSlot client={userInfo.client} />}
                    />
                    <Content main>
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
                            endSlot={<HeaderButton url={links.feedbackForm} label="Feedback" />}
                        />
                    </BottomBanner>
                    <OlmoFooter />
                </RelativeContainer>
            ) : null}
        </OuterContainer>
    );
};
const WhiteTypography = styled(Typography)`
    padding-top: ${({ theme }) => theme.spacing(1)};
    color: white;
`;

const AbsoluteContainer = styled('div')`
    position: absolute;
    z-index: 5;
`;

const RelativeContainer = styled('div')`
    position: relative;
    z-index: 10;
    min-height: 100vh;
    max-width: ${({ theme }) => `${theme.breakpoints.values.lg}${theme.breakpoints.unit}`};
    margin: auto;
`;

const LoadingContainer = styled('div')`
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

const BottomBanner = styled('div')`
    margin: ${({ theme }) => theme.spacing(2)};
`;

const OuterContainer = styled('div')`
    position: relative;
    overflow: hidden;
    background: ${({ theme }) =>
        // @ts-expect-error we haven't updated the types for the old custom theme
        `linear-gradient(122deg, ${theme.color2.N7} 0%, transparent 100%), ${theme.color2.N8}`};
`;

interface BannerButtonProps {
    component: typeof Link;
}

const BannerButton = styled(Button)<LinkProps & BannerButtonProps>`
    && {
        color: white;
        border-color: white;
        margin: ${({ theme }) => theme.spacing(0.5)};
    }
    &&:hover {
        border-color: white;
    }
`;
