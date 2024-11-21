import { Box } from '@mui/material';
import { PropsWithChildren } from 'react';

export const ThreadMaxWidthContainer = ({ children }: PropsWithChildren) => {
    return (
        <Box
            height={1}
            sx={{
                maxWidth: '750px',
                margin: '0 auto',

                display: 'grid',
                gridTemplateColumns: 'auto 1fr',

                rowGap: 2,
                columnGap: 2,

                paddingInlineEnd: 2,
            }}>
            {children}
        </Box>
    );
};
