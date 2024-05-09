import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useAppContext } from '@/AppContext';

interface UseCloseDrawerOnNavigationProps {
    handleDrawerClose: () => void;
}

export const useCloseDrawerOnNavigation = ({
    handleDrawerClose,
}: UseCloseDrawerOnNavigationProps) => {
    const location = useLocation();
    const currentRoute = useAppContext((state) => state.currentRoute);
    const setCurrentRoute = useAppContext((state) => state.setCurrentRoute);
    useEffect(() => {
        if (currentRoute !== location.pathname) {
            handleDrawerClose();
            setCurrentRoute(location.pathname);
        }
    }, [handleDrawerClose, location.pathname]);
};
