import { css } from '@allenai/varnish-panda-runtime/css';
import { Box } from '@mui/material';
import type { PropsWithChildren, ReactNode } from 'react';

const startAdornmentClassName = css({
    display: 'flex',
    gap: '1',
});

const endAdornmentClassName = css({
    display: 'flex',
    gap: '1',
});

interface PromptContainerProps extends PropsWithChildren {
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
}

export const PromptContainer = ({
    startAdornment,
    endAdornment,
    children,
}: PromptContainerProps): ReactNode => {
    return (
        <Box
            sx={(theme) => ({
                width: 1,
                display: 'flex',
                alignItems: 'end',
                columnGap: theme.spacing(1),
            })}>
            <div className={startAdornmentClassName}>{startAdornment}</div>
            {children}
            <div className={endAdornmentClassName}>{endAdornment}</div>
        </Box>
    );
};
