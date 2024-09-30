import { useEffect } from 'react';
import { useNavigation } from 'react-router-dom';

interface UseCloseDrawerOnNavigationProps {
    handleDrawerClose: () => void;
}

export const useCloseDrawerOnNavigation = ({
    handleDrawerClose,
}: UseCloseDrawerOnNavigationProps) => {
    const navigation = useNavigation();
    useEffect(() => {
        if (navigation.state === 'loading' && !navigation.location.pathname.includes('thread')) {
            handleDrawerClose();
        }
    }, [handleDrawerClose, navigation]);
};
