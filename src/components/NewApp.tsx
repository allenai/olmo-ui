import { Container, Paper, PaperProps } from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { DESKTOP_LAYOUT_BREAKPOINT } from '../constants';

import { useTrackPageView } from '@/analytics/useTrackPageView';
import { useAppContext } from '../AppContext';
import { Footer } from './Footer/Footer';
import { GlobalAlertList } from './GlobalAlertList';
import { MobilePageTitle } from './OlmoAppBar/MobilePageTitle';
import { OlmoAppBar } from './OlmoAppBar/OlmoAppBar';
import { TermsAndConditionsModal } from './TermsAndConditionsModal';
import { HistoryDrawer } from './thread/history/HistoryDrawer';
import { ParameterDrawer } from './thread/parameter/ParameterDrawer';

export const NewApp = () => {
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
            })
            .catch((error: unknown) => {
                console.error('Failed to get user info');
                throw error;
            });
    }, [getSchema, getUserInfo]);

    const showModal = userInfo?.hasAcceptedTermsAndConditions === false;
    return (
        <OuterContainer square variant="outlined">
            {!isLoading && userInfo && schema ? (
                <>
                    <OlmoAppBar />
                    <GlobalAlertList />
                    {showModal && <TermsAndConditionsModal />}
                    <Container
                        component="main"
                        sx={{
                            overflow: 'auto',

                            paddingInline: 2,
                            paddingBlockStart: { [DESKTOP_LAYOUT_BREAKPOINT]: 4 },
                            // This is to give a little more height to the layout so it's a little easier to see at the end. If we add a footer we can remove this!
                            // on mobile, we need more space because of the fixed header
                            paddingBlockEnd: { xs: 16, [DESKTOP_LAYOUT_BREAKPOINT]: 4 },

                            height: 1,

                            gridArea: 'content',

                            backgroundColor: (theme) => ({
                                xs: theme.palette.background.default,
                                [DESKTOP_LAYOUT_BREAKPOINT]: 'transparent',
                            }),
                        }}
                        maxWidth={false}>
                        <MobilePageTitle />
                        <Outlet />
                        <Footer />
                    </Container>
                </>
            ) : null}
            <HistoryDrawer />
            {schema && <ParameterDrawer schemaData={schema} />}
        </OuterContainer>
    );
};

interface OuterContainerProps extends PaperProps {
    isNavigationDrawerOpen?: boolean;
}

const OuterContainer = ({ isNavigationDrawerOpen, ...rest }: OuterContainerProps) => {
    return (
        <Paper
            sx={[
                (theme) => ({
                    height: '100vh',
                    width: '100%',

                    [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                        display: 'grid',
                        gridTemplateAreas: `
                            'nav app-bar side-drawer'
                            'nav content side-drawer'`,
                        gridTemplateRows: 'auto 1fr',
                        gridTemplateColumns: 'auto 1fr auto',
                        gap: theme.spacing(8),
                    },
                }),
            ]}
            {...rest}
        />
    );
};
