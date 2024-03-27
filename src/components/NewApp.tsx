import { Paper, styled } from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { useAppContext } from '../AppContext';
import { GlobalAlertList } from './GlobalAlertList';
import { OlmoAppBar } from './OlmoAppBar/OlmoAppBar';

export const NewApp = () => {
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
            .finally(() => setLoading(false));
    }, []);

    return (
        <OuterContainer elevation={1} square variant="outlined">
            {!isLoading && userInfo.data && schema.data ? (
                <>
                    <OlmoAppBar />
                    <main style={{ gridArea: 'content' }}>
                        <GlobalAlertList />
                        <Outlet />
                    </main>
                </>
            ) : null}
        </OuterContainer>
    );
};

const OuterContainer = styled(Paper)`
    ${({ theme }) => theme.breakpoints.up('sm')} {
        display: grid;

        grid-template-areas:
            'nav app-bar'
            'nav content';

        grid-template-rows: auto 1fr;
        grid-template-columns: auto 1fr;

        grid-column-gap: ${({ theme }) => theme.spacing(8)};
        grid-row-gap: ${({ theme }) => theme.spacing(4)};
    }

    height: 100vh;
    width: 100vw;
`;
