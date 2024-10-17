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
        <ListSubheader
            sx={{
                paddingBlock: 1,
                lineHeight: '42px', // This was set higher up as 48px -- reducing here.
                backgroundColor: 'transparent',
                position: 'static',
            }}>
            <Typography variant="h5" component="strong" margin={0} color={color}>
                {children}
            </Typography>
        </ListSubheader>
    );
};
