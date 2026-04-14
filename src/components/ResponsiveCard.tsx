import type { CardProps } from '@mui/material';
import { Card, Stack, styled } from '@mui/material';

import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';

type ThreadPageCardProps = Pick<CardProps, 'sx' | 'children'>;

const ResponsiveCardBase = styled(Card)(({ theme }) => ({
    backgroundColor: theme.vars.palette.background.drawer.secondary,
    border: 0, // This removes the border from the outlined version of the component.
    borderRadius: 0,
    paddingBlock: theme.spacing(2),

    [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
        paddingInline: theme.spacing(2),
        paddingBlock: theme.spacing(4),
        borderRadius: theme.spacing(1),
    },
}));

export const ResponsiveCard = ({ sx, children }: ThreadPageCardProps): JSX.Element => {
    return (
        <ResponsiveCardBase sx={sx}>
            <Stack
                gap={2}
                sx={{
                    padding: 0,
                }}>
                {children}
            </Stack>
        </ResponsiveCardBase>
    );
};
