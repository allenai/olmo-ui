import { Box } from '@mui/material';
import { PropsWithChildren } from 'react';

import { ThreadMaxWidthContainer } from '../ThreadDisplay/ThreadMaxWidthContainer';

export const ThreadPlaceholderContentWrapper = ({ children }: PropsWithChildren) => {
    return (
        <Box
            height={1}
            data-testid="thread-placeholder"
            overflow="scroll"
            sx={{
                '@media (prefers-reduced-motion: no-preference)': {
                    scrollBehavior: 'smooth',
                },
                paddingInline: 2,

                // TODO: https://github.com/allenai/olmo-ui/issues/825 Combine this and the ThreadDisplay layout
                overflowY: 'auto',
                overflowX: 'auto',
                scrollbarGutter: 'stable',
            }}>
            <ThreadMaxWidthContainer gridTemplateRows="auto 1fr auto" sx={{ height: '100%' }}>
                {children}
            </ThreadMaxWidthContainer>
        </Box>
    );
};
