import { Box } from '@mui/material';
import type { PropsWithChildren, ReactElement } from 'react';

export const ParametersList = ({ children }: PropsWithChildren): ReactElement => (
    <Box component="ul" margin="0" padding="0" display="grid" gridTemplateColumns="1fr auto">
        {children}
    </Box>
);
