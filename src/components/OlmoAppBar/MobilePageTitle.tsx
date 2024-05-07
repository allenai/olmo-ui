import { Typography } from '@mui/material';

import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';

import { useRouteTitle } from './useRouteTitle';

export const MobilePageTitle = (): JSX.Element => {
    const title = useRouteTitle();

    return (
        <Typography
            variant="h4"
            component="h1"
            lineHeight={1.3}
            paddingBlock={4}
            sx={{
                color: (theme) => theme.palette.primary.main,
                margin: 0,
                display: { xs: 'block', [DESKTOP_LAYOUT_BREAKPOINT]: 'none' },
            }}>
            {title}
        </Typography>
    );
};
