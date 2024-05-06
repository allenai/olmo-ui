import { Card, Stack } from '@mui/material';
import { PropsWithChildren } from 'react';

import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';

import { useDesktopOrUp } from '../dolma/shared';

interface ThreadPageCardProps extends PropsWithChildren {}

export const ThreadCard = ({ children }: ThreadPageCardProps): JSX.Element => {
    const isDesktopOrUp = useDesktopOrUp();

    return (
        <Card
            variant={isDesktopOrUp ? 'elevation' : 'outlined'}
            sx={(theme) => ({
                borderRadius: 0,
                // This component uses screen size rather than container queries
                // We want it to always be a card on desktop and always be flat on mobile
                [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                    padding: 2,
                    borderRadius: '12px',
                },

                backgroundColor: (theme) => theme.palette.background.default,

                // This removes the border from the outlined version of the component. Doesn't affect the elevated version.
                border: 0,
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
