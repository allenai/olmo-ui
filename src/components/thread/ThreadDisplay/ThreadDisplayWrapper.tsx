import { Box, BoxProps, Theme } from '@mui/material';
import { forwardRef, PropsWithChildren } from 'react';

import { LegalNotice } from '../LegalNotice/LegalNotice';
import { ThreadMaxWidthContainer } from './ThreadMaxWidthContainer';

type ThreadDisplayWrapperProps = PropsWithChildren & Pick<BoxProps, 'onScroll'>;

export const ThreadDisplayWrapper = forwardRef<HTMLDivElement, ThreadDisplayWrapperProps>(
    function ThreadDisplayWrapper({ children, onScroll }, ref) {
        return (
            <Box
                height={1}
                data-testid="thread-display"
                onScroll={onScroll}
                ref={ref}
                sx={{
                    '@media (prefers-reduced-motion: no-preference)': {
                        scrollBehavior: 'smooth',
                    },
                    paddingInline: 2,
                    overflowY: 'scroll',
                    scrollbarColor: (theme) =>
                        `${theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.light} transparent`,
                }}>
                <Box
                    sx={{
                        pointerEvents: 'none',
                        top: '-1px',
                        position: 'sticky',
                        boxShadow: (theme: Theme) =>
                            `0 12px 50px 12px ${theme.palette.background.paper}`,
                    }}
                />
                <ThreadMaxWidthContainer>
                    <Box gridColumn="2 / -1">
                        <LegalNotice />
                    </Box>
                    {children}
                </ThreadMaxWidthContainer>
                <Box
                    sx={{
                        pointerEvents: 'none',
                        bottom: '-1px',
                        position: 'sticky',

                        boxShadow: (theme) => `0 -12px 50px 12px ${theme.palette.background.paper}`,
                    }}
                />
            </Box>
        );
    }
);
