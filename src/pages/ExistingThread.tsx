import { useParams } from 'react-router-dom';

import { useEffect } from 'react';

import { useAppContext } from '../AppContext';

import { QueryForm } from '../components/thread/QueryForm';

import { ThreadPageCard } from '../components/thread/ThreadPageCard';

import { ThreadView } from '../components/thread/ThreadAndPrompt';

export const ExistingThreadPage = (): JSX.Element => {
    // const { id } = useParams();

    // const getSelectedThread = useAppContext((state) => state.getSelectedThread);
    // const selectedThreadInfo = useAppContext((state) => state.selectedThreadInfo);

    // useEffect(() => {
    //     if (id != null) {
    //         getSelectedThread(id);
    //     }
    // }, []);

    return (
        <ThreadPageCard>
            <ThreadView />
            <QueryForm onSubmit={() => {}} variant="response" />
        </ThreadPageCard>
    );
};
