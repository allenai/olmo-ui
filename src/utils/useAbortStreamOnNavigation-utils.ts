import { useEffect } from 'react';
import { useNavigation } from 'react-router-dom';

interface UseAbortStreamOnNavigationProps {
    abortStreams: () => void;
}

// This is just a temp fix for feature parity with production
// When multiple streams from playground are possible, remove this
export const useAbortStreamOnNavigation = ({
    abortStreams,
}: UseAbortStreamOnNavigationProps): void => {
    const navigation = useNavigation();

    useEffect(() => {
        if (navigation.state === 'loading' && navigation.location) {
            const targetPath = navigation.location.pathname;

            // Abort any active streams when user goes to "New chat"
            if (targetPath === '/') {
                abortStreams();
            }
        }
    }, [abortStreams, navigation]);
};
