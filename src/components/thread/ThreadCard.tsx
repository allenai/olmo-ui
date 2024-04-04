import { Card, Stack, useMediaQuery, useTheme } from '@mui/material';
import { PropsWithChildren } from 'react';

import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';
import { biggerContainerQuery, smallerContainerQuery } from '@/utils/container-query-utils';

interface ThreadPageCardProps extends PropsWithChildren {}

export const ThreadCard = ({ children }: ThreadPageCardProps): JSX.Element => {
    const theme = useTheme();
    const isDesktopOrUp = useMediaQuery(theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT));

    return (
        <Card
            variant={isDesktopOrUp ? 'elevation' : 'outlined'}
            sx={(theme) => ({
                padding: 0,
                [biggerContainerQuery(theme)]: {
                    padding: 2,
                },

                backgroundColor: (theme) => theme.palette.background.default,

                border: 0,
                [smallerContainerQuery(theme)]: {
                    borderRadius: 0,
                },
            })}>
            <Stack
                component={Stack}
                gap={2}
                sx={{
                    padding: 0,
                }}>
                {children}
            </Stack>
        </Card>
    );
};
