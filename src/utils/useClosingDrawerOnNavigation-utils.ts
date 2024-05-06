import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { links } from '@/Links';

interface UseCloseDrawerOnNavigationProps {
    handleDrawerClose: () => void;
}

export const useCloseDrawerOnNavigation = ({
    handleDrawerClose,
}: UseCloseDrawerOnNavigationProps) => {
    const location = useLocation();
    useEffect(() => {
        if (location.pathname !== links.playground) {
            handleDrawerClose();
        }
    });
};
