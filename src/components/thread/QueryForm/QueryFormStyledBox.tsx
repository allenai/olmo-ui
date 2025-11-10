import { Box } from '@mui/material';
import type { PropsWithChildren, ReactNode } from 'react';

export const QueryFormStyledBox = ({ children }: PropsWithChildren): ReactNode => {
    return (
        <Box width={1} paddingInline={2}>
            <Box
                // data-text-value={value}
                sx={(theme) => ({
                    //

                    borderRadius: theme.spacing(3.5),
                    paddingBlock: 1,
                    paddingInline: 2,
                    background: theme.palette.background.drawer.secondary,
                    border: '2px solid transparent',

                    [`&:has(:focus-visible)`]: {
                        border: (theme) => `2px solid ${theme.palette.secondary.main}`,
                    },

                    '@supports not (selector(:focus-visible)) or (selector(:has(*))': {
                        ':focus-within': {
                            border: (theme) => `2px solid ${theme.palette.secondary.main}`,
                        },
                    },
                })}>
                {children}
            </Box>
        </Box>
    );
};
