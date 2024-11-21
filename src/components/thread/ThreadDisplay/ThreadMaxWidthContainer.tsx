import { Box, styled } from '@mui/material';

import { CHAT_ICON_WIDTH } from '../ChatMessage';

export const ThreadMaxWidthContainer = styled(Box)(({ theme }) => ({
    maxWidth: '750px',
    margin: '0 auto',
    flex: '1',

    display: 'grid',
    gridTemplateColumns: `${CHAT_ICON_WIDTH}px 1fr`,
    gridAutoRows: 'min-content',

    rowGap: theme.spacing(2),
    columnGap: theme.spacing(2),
    paddingInline: theme.spacing(2),
    paddingBlockStart: theme.spacing(3),
}));
