import { useEffect } from 'react';
import { useNavigation } from 'react-router';

interface UseCloseDrawerOnNavigationProps {
    handleDrawerClose: () => void;
}

export const useCloseDrawerOnNavigation = ({
    handleDrawerClose,
}: UseCloseDrawerOnNavigationProps): void => {
    const navigation = useNavigation();
    useEffect(() => {
        if (navigation.state === 'loading') {
            handleDrawerClose();
        }
    }, [handleDrawerClose, navigation]);
};
