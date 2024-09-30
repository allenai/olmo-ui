import { ListSubheader, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

interface NavigationHeadingProps extends PropsWithChildren {
    color?: string;
}

export const NavigationHeading = ({
    children,
    color = 'primary',
}: NavigationHeadingProps): JSX.Element => {
    return (
        <ListSubheader sx={{ paddingBlock: 2, backgroundColor: 'transparent', position: 'static' }}>
            <Typography variant="h6" margin={0} color={color}>
                {children}
            </Typography>
        </ListSubheader>
    );
};
