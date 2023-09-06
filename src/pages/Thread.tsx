import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Alert, LinearProgress } from '@mui/material';

import { Content } from '../components/shared';
import { MajorityScreen } from '../components/MajorityScreen';
import { ThreadBodyView } from '../components/ThreadBodyView';
import { useAppContext } from '../AppContext';

export const Thread = () => {
    const { id } = useParams();
    if (!id) {
        return <h3>Please specify a message id.</h3>;
    }

    const { getSelectedThread, selectedThreadInfo } = useAppContext();

    useEffect(() => {
        getSelectedThread(id);
    }, []);

    return (
        <MajorityScreen>
            <Content>
                <ThreadContainer>
                    {!selectedThreadInfo.error &&
                    !selectedThreadInfo.loading &&
                    selectedThreadInfo.data ? (
                        <>
                            {selectedThreadInfo.data.deleted ? (
                                <Alert severity="warning">This message has been deleted.</Alert>
                            ) : null}
                            <ThreadBodyView messages={[selectedThreadInfo.data]} />
                        </>
                    ) : null}
                    {selectedThreadInfo.loading ? <LinearProgress /> : null}
                </ThreadContainer>
                <NewQueryLink to={'/'}>New Query</NewQueryLink>
            </Content>
        </MajorityScreen>
    );
};

const NewQueryLink = styled(Link)`
    &&& {
        color: white;
    }
`;

const ThreadContainer = styled.div`
    padding: ${({ theme }) => theme.spacing(2)};
    background-color: white;
    border-radius: 10px;
`;
