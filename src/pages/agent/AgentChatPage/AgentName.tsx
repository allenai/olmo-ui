import { css } from '@allenai/varnish-panda-runtime/css';
import { Typography } from '@mui/material';
import type { PropsWithChildren } from 'react';

export const AgentName = ({ children }: PropsWithChildren) => {
    return (
        <div
            className={css({
                paddingBlockEnd: '4',
                marginInline: 'auto',
                width: '[100%]',
                maxWidth: '[750px]',
            })}>
            <Typography component="h2" variant="h5" marginInline={2}>
                {children}
            </Typography>
        </div>
    );
};
