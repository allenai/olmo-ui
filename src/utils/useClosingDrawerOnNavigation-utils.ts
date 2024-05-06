import { links } from '@/Links';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface UseClosingDrawerOnNavigationProps {
    handleDrawerClose: () => void;
}

export const useClosingDrawerOnNavigation = ({
    handleDrawerClose,
}: UseClosingDrawerOnNavigationProps) => {
    const location = useLocation();
    useEffect(() => {
        if (location.pathname !== links.playground) {
            handleDrawerClose();
        }
    });
};
