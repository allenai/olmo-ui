import { Box, styled } from '@mui/material';

import { CHAT_ICON_WIDTH } from '../ChatMessage';

export const ThreadMaxWidthContainer = styled(Box)({
    maxWidth: '750px',
    margin: '0 auto',
    flex: '1',

    display: 'grid',
    gridTemplateColumns: `${CHAT_ICON_WIDTH}px 1fr`,
    gridAutoRows: 'min-content',

    rowGap: 2,
    columnGap: 2,

    paddingInline: 2,
});
