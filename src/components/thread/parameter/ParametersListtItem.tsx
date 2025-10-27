import { Box } from '@mui/material';
import type { PropsWithChildren, ReactElement } from 'react';

export const ParametersListItem = ({ children }: PropsWithChildren): ReactElement => (
    <Box component="li" display="grid" gridTemplateColumns="subgrid" gridColumn="1 / -1">
        {children}
    </Box>
);
