import { Container, Paper, PaperProps } from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { useTrackPageView } from '@/analytics/useTrackPageView';

import { useAppContext } from '../AppContext';
import { DESKTOP_LAYOUT_BREAKPOINT } from '../constants';
import { useDesktopOrUp } from './dolma/shared';
import { FAQDrawer } from './faq/FAQDrawer';
import { GlobalSnackMessageList } from './GlobalSnackMessageList';
import { OlmoAppBar } from './OlmoAppBar/OlmoAppBar';
import { TermsAndConditionsModal } from './TermsAndConditionsModal';
import { AttributionDrawer } from './thread/attribution/drawer/AttributionDrawer';
import { HistoryDrawer } from './thread/history/HistoryDrawer';
import { ParameterDrawer } from './thread/parameter/ParameterDrawer';

export const NewApp = () => {
    useTrackPageView();

    const userInfo = useAppContext((state) => state.userInfo);
    const getUserInfo = useAppContext((state) => state.getUserInfo);
    const schema = useAppContext((state) => state.schema);
    const getSchema = useAppContext((state) => state.getSchema);

    const [isLoading, setLoading] = useState(true);

    const isDesktop = useDesktopOrUp();

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
                    <GlobalSnackMessageList />
                    {showModal && <TermsAndConditionsModal />}
                    <Container
                        component="main"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',

                            overflow: 'auto',

                            paddingInline: 2,
                            paddingBlockEnd: { [DESKTOP_LAYOUT_BREAKPOINT]: 4 },

                            height: 1,

                            gridArea: 'content',

                            backgroundColor: (theme) => ({
                                xs: theme.palette.background.default,
                                [DESKTOP_LAYOUT_BREAKPOINT]: 'transparent',
                            }),
                        }}
                        maxWidth={false}>
                        <Outlet />
                    </Container>
                </>
            ) : null}
            <HistoryDrawer />
            <AttributionDrawer />
            {schema && <ParameterDrawer schemaData={schema} />}
            {!isDesktop && <FAQDrawer />}
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

                    display: 'grid',
                    gridTemplateAreas: `
                        'app-bar'
                        'content'
                    `,
                    gridTemplateRows: 'auto 1fr',

                    [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                        gridTemplateAreas: `
                            'nav app-bar side-drawer'
                            'nav content side-drawer'`,
                        gridTemplateRows: 'auto minmax(0, 1fr)',
                        gridTemplateColumns: 'auto minmax(0, 1fr) auto',
                        columnGap: theme.spacing(8),
                    },
                }),
            ]}
            {...rest}
        />
    );
};
