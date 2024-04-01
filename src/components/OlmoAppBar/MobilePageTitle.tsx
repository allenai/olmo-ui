import { Typography } from '@mui/material';

import { useRouteTitle } from './useRouteTitle';
import { DesktopLayoutBreakpoint } from '@/constants';

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
                display: { xs: 'block', [DesktopLayoutBreakpoint]: 'none' },
            }}>
            {title}
        </Typography>
    );
};
