import { Alert, LinearProgress } from '@mui/material';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Content } from '@/components/shared';

import { useAppContext } from '../AppContext';
import { ContextMenu } from '../components/ContextMenu';
import { MajorityScreen } from '../components/MajorityScreen';
import { StandardContainer } from '../components/StandardContainer';
import { ThreadBodyView } from '../components/ThreadBodyView';

export const Thread = () => {
    const { id } = useParams();

    const getSelectedThread = useAppContext((state) => state.getSelectedThread);
    const selectedThreadInfo = useAppContext((state) => state.selectedThreadInfo);

    useEffect(() => {
        if (id) {
            getSelectedThread(id);
        }
    }, [getSelectedThread, id]);

    if (!id) {
        return <h3>Please specify a message id.</h3>;
    }

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
