import { Stack } from '@mui/material';

import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';

export const ContentContainer = ({ children }: React.PropsWithChildren) => {
    return (
        <Stack
            gap={0}
            sx={(theme) => ({
                containerName: 'thread-page',
                containerType: 'inline-size',

                backgroundColor: 'transparent',
                height: 1,
                paddingBlockEnd: 2,
                paddingBlockStart: 2,

                position: 'relative',
                overflow: 'hidden',

                [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                    gridArea: 'main-content',
                    paddingBlockStart: 6,
                    // these are needed because grid automatically sets them to auto, which breaks the overflow behavior we want
                    minHeight: 0,
                    minWidth: 0,
                },
            })}>
            {children}
        </Stack>
    );
};
