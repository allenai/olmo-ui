import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ClosingDrawerOnNavigationProps {
    path: string;
    handleDrawerClose: () => void;
}

export const closingDrawerOnNavigation = ({
    path,
    handleDrawerClose,
}: ClosingDrawerOnNavigationProps) => {
    const location = useLocation();
    useEffect(() => {
        if (location.pathname === path) {
            handleDrawerClose();
        }
    });
};
