import { Card, CardContent, Stack, useMediaQuery, useTheme } from '@mui/material';
import { PropsWithChildren } from 'react';

import { DesktopLayoutBreakpoint } from '@/constants';
import { biggerContainerQuery } from '@/utils/container-query-utils';

interface ThreadPageCardProps extends PropsWithChildren {}

export const ThreadCard = ({ children }: ThreadPageCardProps): JSX.Element => {
    const theme = useTheme();
    const isDesktopOrUp = useMediaQuery(theme.breakpoints.up(DesktopLayoutBreakpoint));

    return (
        <Card
            variant={isDesktopOrUp ? 'elevation' : 'outlined'}
            sx={(theme) => ({
                padding: 0,
                [biggerContainerQuery(theme)]: {
                    padding: 2,
                },

                backgroundColor: (theme) => theme.palette.background.default,
                height: 'fit-content',

                border: 0,
            })}>
            <CardContent
                component={Stack}
                gap={2}
                sx={{
                    padding: 0,
                }}>
                {children}
            </CardContent>
        </Card>
    );
};
