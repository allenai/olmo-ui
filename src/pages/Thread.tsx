import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Alert, LinearProgress } from '@mui/material';

import { Content } from '@/components/shared';
import { MajorityScreen } from '../components/MajorityScreen';
import { ThreadBodyView } from '../components/ThreadBodyView';
import { useAppContext } from '../AppContext';
import { StandardContainer } from '../components/StandardContainer';
import { ContextMenu } from '../components/ContextMenu';
import { RemoteState } from '@/contexts/util';

export const Thread = () => {
    const { id } = useParams();
    if (!id) {
        return <h3>Please specify a message id.</h3>;
    }

    const getSelectedThread = useAppContext((state) => state.getSelectedThread);
    const selectedThread = useAppContext((state) => state.selectedThread);
    const selectedThreadRemoteState = useAppContext((state) => state.selectedThreadRemoteState);

    useEffect(() => {
        getSelectedThread(id);
    }, []);

    return (
        <MajorityScreen>
            <ContextMenu>
                <Content>
                    <StandardContainer>
                        {selectedThreadRemoteState === RemoteState.Loaded && !!selectedThread ? (
                            <>
                                {selectedThread.deleted ? (
                                    <Alert severity="warning">This message has been deleted.</Alert>
                                ) : null}
                                <ThreadBodyView messages={[selectedThread]} showFollowUp={false} />
                            </>
                        ) : null}
                        {selectedThreadRemoteState === RemoteState.Loading ? (
                            <LinearProgress />
                        ) : null}
                    </StandardContainer>
                    <NewQueryLink to={'/'}>New Query</NewQueryLink>
                </Content>
            </ContextMenu>
        </MajorityScreen>
    );
};

const NewQueryLink = styled(Link)`
    &&& {
        color: white;
    }
`;
