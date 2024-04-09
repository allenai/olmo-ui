import { ListSubheader, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

interface NavigationHeadingProps extends PropsWithChildren {}

export const NavigationHeading = ({ children }: NavigationHeadingProps): JSX.Element => {
    return (
        <ListSubheader sx={{ paddingBlock: 2, backgroundColor: 'transparent', position: 'static' }}>
            <Typography variant="h6" margin={0} color="primary">
                {children}
            </Typography>
        </ListSubheader>
    );
};
