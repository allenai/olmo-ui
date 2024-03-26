import { useEffect, useState } from 'react';
import { BannerLink, Content, Footer, logos } from '@allenai/varnish2/components';
import { LinkProps, Link, Outlet } from 'react-router-dom';
import { Button, Grid, CircularProgress, Typography, styled } from '@mui/material';

import { useAppContext } from '../AppContext';
import { OlmoBanner } from './OlmoBanner';
import { GlobalAlertList } from './GlobalAlertList';
import { WallpaperCircle } from './WallpaperCircle';
import { olmoTheme } from '../olmoTheme';
import { useFeatureToggles } from '../FeatureToggleContext';
import { OlmoAppBar } from './OlmoAppBar/OlmoAppBar';
import { OlmoLogo } from './logos/OlmoLogo';

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
                    <HeaderButton url="https://dolma.allen.ai" label="Explore Dataset" />
                </Grid>
                <Grid item>
                    <HeaderButton openOnNewPage={true} url={feedbackFormUrl} label="Feedback" />
                </Grid>
            </Grid>
        </>
    );
};

export const NewApp = () => {
    const userInfo = useAppContext((state) => state.userInfo);
    const getUserInfo = useAppContext((state) => state.getUserInfo);
    const schema = useAppContext((state) => state.schema);
    const getSchema = useAppContext((state) => state.getSchema);

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
            console.table(toggles);
        }
    }, []);

    return (
        <OuterContainer>
            {/* <AbsoluteContainer>
                <WallpaperCircle color={olmoTheme.color2.N8.hex} />
            </AbsoluteContainer>
            {isLoading ? (
                <LoadingContainer>
                    <CircularProgress sx={{ color: '#fff' }} />
                </LoadingContainer>
            ) : null} */}
            {!isLoading && userInfo.data && schema.data ? (
                <>
                    <OlmoAppBar />
                    <main style={{ gridArea: 'content' }}>
                        <GlobalAlertList />
                        <Outlet />
                    </main>
                    {/* <BottomBanner>
                        <OlmoBanner
                            bannerLogo={
                                <BannerLink href="https://allenai.org">
                                    <logos.AI2Logo color="white" size="md" />
                                </BannerLink>
                            }
                            transparentBackground={false}
                            endSlot={<HeaderButton url={feedbackFormUrl} label="Feedback" />}
                        />
                    </BottomBanner> */}
                    {/* <OlmoFooter /> */}
                </>
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
    color: white;
    background-color: transparent;
    padding-top: 0px;
    grid-area: footer;

    a {
        color: white;
    }
`;

const BottomBanner = styled('div')`
    margin: ${({ theme }) => theme.spacing(2)};
`;

const OuterContainer = styled('div')`
    display: grid;
    grid-template-areas:
        'nav app-bar'
        'nav content'
    grid-template-rows: auto 1fr;
    grid-template-columns: auto 1fr;

    background: ${({ theme }) =>
        `linear-gradient(122deg, ${theme.color.N7} 0%, transparent 100%), ${theme.color.N8}`};
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
