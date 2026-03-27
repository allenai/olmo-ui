import { Typography } from '@mui/material';
import type { PropsWithChildren, ReactNode } from 'react';

export const QueryFormError = ({ children }: PropsWithChildren): ReactNode => (
    <Typography
        variant="subtitle2"
        component="p"
        sx={{ alignSelf: 'center', textAlign: 'center' }}
        color={(theme) => theme.palette.error.main}>
        {children}
    </Typography>
);
