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

export const Thread = () => {
    const { id } = useParams();
    if (!id) {
        return <h3>Please specify a message id.</h3>;
    }

    const getSelectedThread = useAppContext((state) => state.getSelectedThread);
    const selectedThreadInfo = useAppContext((state) => state.selectedThreadInfo);

    useEffect(() => {
        getSelectedThread(id);
    }, []);

    return (
        <MajorityScreen>
            <ContextMenu>
                <Content>
                    <StandardContainer>
                        {!selectedThreadInfo.error &&
                        !selectedThreadInfo.loading &&
                        selectedThreadInfo.data ? (
                            <>
                                {selectedThreadInfo.data.deleted ? (
                                    <Alert severity="warning">This message has been deleted.</Alert>
                                ) : null}
                                <ThreadBodyView
                                    messages={[selectedThreadInfo.data]}
                                    showFollowUp={false}
                                />
                            </>
                        ) : null}
                        {selectedThreadInfo.loading ? <LinearProgress /> : null}
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
