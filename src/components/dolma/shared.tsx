import {
    Box,
    Breakpoint,
    Card,
    CardProps,
    Container,
    Grid,
    IconButton,
    Paper,
    PaperProps,
    Snackbar,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { DESKTOP_LAYOUT_BREAKPOINT, SMALL_LAYOUT_BREAKPOINT } from '@/constants';

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

export const ElevatedCard = ({ children, ...cardProps }: CardProps) => (
    <Card
        variant="elevation"
        elevation={1}
        sx={{
            padding: (theme) => theme.spacing(2.25),
            backgroundColor: (theme) => theme.palette.background.default,
        }}
        {...cardProps}>
        {children}
    </Card>
);

export const ElevatedPaper = ({ children, ...paperProps }: PaperProps) => (
    <Paper
        elevation={1}
        sx={{
            padding: (theme) => theme.spacing(2.25),
            borderRadius: '12px',
            backgroundColor: (theme) => theme.palette.background.default,
        }}
        {...paperProps}>
        {children}
    </Paper>
);

interface CopyToClipboardButtonProps {
    text?: string;
    autoHideDuration?: number;
    buttonContent?: React.ReactNode;
    ariaLabel?: string;
    children: React.ReactNode;
}

export function CopyToClipboardButton({
    text,
    autoHideDuration,
    buttonContent,
    ariaLabel,
    children,
}: CopyToClipboardButtonProps) {
    const [open, setOpen] = useState<boolean>(false);
    const value = text || JSON.stringify(children);
    const handleClick = () => {
        setOpen(true);
        navigator.clipboard.writeText(value);
    };

    return (
        <Box sx={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            <IconButton
                size="small"
                aria-label={ariaLabel || 'Copy'}
                onClick={handleClick}
                sx={{
                    padding: '0',
                    verticalAlign: 'top',
                    color: (theme) => theme.color.N8.hex,
                    opacity: 0.66,
                }}>
                {buttonContent || 'Copy'}
            </IconButton>
            <Snackbar
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
                autoHideDuration={autoHideDuration || 2500}
                message={`Copied '${value}' to clipboard`}
            />
            {children}
        </Box>
    );
}

export const useIsOnlyBreakpoint = (breakpoint: Breakpoint): boolean => {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.only(breakpoint));
};

export const useDesktopOrUp = (): boolean => {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT));
};

export const useSmallLayoutOrUp = (): boolean => {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.up(SMALL_LAYOUT_BREAKPOINT));
};
