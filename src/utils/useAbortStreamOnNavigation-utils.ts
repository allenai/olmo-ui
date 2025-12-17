import { useEffect } from 'react';
import { useNavigation } from 'react-router-dom';

import { links } from '@/Links';

interface UseAbortStreamOnNavigationProps {
    basePath: string; // /thread/ or /comparison/ or /agent/blah -- etc
    threadId: string | undefined;
    abortStreams: () => void;
}

// This is just a temp fix for feature parity with production
// When multiple streams from playground are possible, remove this
export const useAbortStreamOnNavigation = ({
    basePath,
    threadId,
    abortStreams,
}: UseAbortStreamOnNavigationProps): void => {
    const navigation = useNavigation();

    useEffect(() => {
        if (navigation.state === 'loading') {
            const targetPath = navigation.location.pathname;

            // if navigating away from the base (/thread/*, or /agent/*, etc)
            // or navigating to different thread
            // abortStreams()
            //
            // limitation:
            // doesnt handle navigating out of the provider that its called from
            if (
                !targetPath.startsWith(basePath) ||
                (threadId && links.thread(threadId) !== targetPath)
            ) {
                abortStreams();
            }
        }
    }, [abortStreams, navigation]);
};
