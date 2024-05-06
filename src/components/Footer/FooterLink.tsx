import { Link, ListItem, ListItemText } from '@mui/material';
import { PropsWithChildren } from 'react';

interface FooterLinkProps extends PropsWithChildren {
    href: string;
}

export const FooterLink = ({ href, children }: FooterLinkProps): JSX.Element => {
    return (
        <ListItem sx={{ width: 'auto' }} disablePadding>
            <ListItemText primaryTypographyProps={{ component: Link, href, variant: 'button' }}>
                {children}
            </ListItemText>
        </ListItem>
    );
};
