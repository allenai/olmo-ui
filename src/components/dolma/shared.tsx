import {
    Breakpoint,
    Card,
    CardProps,
    Container,
    Grid,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import {
    DESKTOP_LAYOUT_BREAKPOINT,
    MEDIUM_LAYOUT_BREAKPOINT,
    SMALL_LAYOUT_BREAKPOINT,
} from '@/constants';

export const ScrollToTopOnPageChange = () => {
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    return null;
};

export const NoPaddingContainer = styled(Container)`
    &&& {
        padding: 0;
    }
`;

export const NoPaddingGrid = styled(Grid)`
    &&& {
        padding-top: 0;
        padding-left: 0;
    }
`;

export const Section = styled.div`
    padding-top: ${({ theme }) => theme.spacing(2)};
    padding-bottom: ${({ theme }) => theme.spacing(2)};
`;

export const PageHeading = styled.h1`
    margin-top: 0px;
    font-size: ${({ theme }) => theme.typography.h2};
`;

export const SectionHeading = styled.h2`
    margin-top: ${({ theme }) => theme.spacing(1)};
    font-size: ${({ theme }) => theme.typography.h3};
`;

export const InfoParagraph = styled.p`
    padding-bottom: ${({ theme }) => theme.spacing(1)};
`;

export const BaseCard = ({ children, ...cardProps }: CardProps) => (
    <Card
        sx={{
            padding: (theme) => theme.spacing(2.25),
            backgroundColor: (theme) => theme.palette.background.default,
        }}
        {...cardProps}>
        {children}
    </Card>
);

export const useIsOnlyBreakpoint = (breakpoint: Breakpoint): boolean => {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.only(breakpoint));
};

export const useDesktopOrUp = (): boolean => {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT));
};

export const useMediumLayoutOrUp = (): boolean => {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.up(MEDIUM_LAYOUT_BREAKPOINT));
};

export const useSmallLayoutOrUp = (): boolean => {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.up(SMALL_LAYOUT_BREAKPOINT));
};
