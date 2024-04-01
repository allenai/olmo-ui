import { Card, CardContent, Stack, useMediaQuery, useTheme } from '@mui/material';
import { PropsWithChildren } from 'react';

import { DesktopLayoutBreakpoint } from '@/constants';

interface ThreadPageCardProps extends PropsWithChildren {}

export const ThreadPageCard = ({ children }: ThreadPageCardProps): JSX.Element => {
    const theme = useTheme();
    const isDesktopOrUp = useMediaQuery(theme.breakpoints.up(DesktopLayoutBreakpoint));

    return (
        <Card
            variant={isDesktopOrUp ? 'elevation' : 'outlined'}
            sx={{
                padding: { xs: 0, [DesktopLayoutBreakpoint]: 2 },
                backgroundColor: (theme) => theme.palette.background.default,
                height: 'fit-content',

                border: 0,
            }}>
            <CardContent component={Stack} gap={2}>
                {children}
            </CardContent>
        </Card>
    );
};
