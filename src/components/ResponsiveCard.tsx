import { Card, Stack, SxProps, Theme, useTheme } from '@mui/material';
import { PropsWithChildren } from 'react';

import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';

import { useDesktopOrUp } from './dolma/shared';

interface ThreadPageCardProps extends PropsWithChildren {
    sx?: SxProps<Theme>;
}

export const ResponsiveCard = ({ sx = [], children }: ThreadPageCardProps): JSX.Element => {
    const theme = useTheme(); // Accessing the theme using useTheme hook
    const isDesktopOrUp = useDesktopOrUp();

    return (
        <Card
            variant={isDesktopOrUp ? 'elevation' : 'outlined'}
            sx={[
                {
                    borderRadius: 0,
                    // Styles based on theme breakpoints
                    [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                        padding: 2,
                        borderRadius: '12px',
                    },
                    backgroundColor: theme.palette.background.default,
                    border: 0, // This removes the border from the outlined version of the component.
                },
                ...(Array.isArray(sx) ? sx : [sx]), // Safely merging the sx prop
            ]}>
            <Stack
                gap={2}
                sx={{
                    padding: 0,
                }}>
                {children}
            </Stack>
        </Card>
    );
};
