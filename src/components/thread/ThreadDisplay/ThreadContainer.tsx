import { Box } from '@mui/material';
import { PropsWithChildren } from 'react';

import { CHAT_ICON_WIDTH } from '../ChatMessage';

export const ThreadMaxWidthContainer = ({ children }: PropsWithChildren) => {
    return (
        <Box
            height={1}
            sx={{
                maxWidth: '750px',
                margin: '0 auto',

                display: 'grid',
                gridTemplateColumns: `${CHAT_ICON_WIDTH}px 1fr`,

                rowGap: 2,
                columnGap: 2,

                paddingInlineEnd: 2,
            }}>
            {children}
        </Box>
    );
};
