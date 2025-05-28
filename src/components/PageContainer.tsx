import { Box } from '@mui/material';

import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';

export const PageContainer = ({ children }: React.PropsWithChildren) => {
    return (
        <Box
            sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                    gridArea: 'content',
                    display: 'grid',
                    transition: '300ms',
                    gridTemplateColumns: '1fr auto',
                    gridTemplateRows: 'auto 1fr',
                    gridTemplateAreas: '"controls ." "main-content drawer"',
                },
            })}>
            {children}
        </Box>
    );
};
