import { Link, List, ListItem, ListItemText, Stack } from '@mui/material';
import { PropsWithChildren } from 'react';

import { links } from '../../Links';

interface NavigationFooterItemProps extends PropsWithChildren {
    href: string;
}

const NavigationFooterItem = ({ href, children }: NavigationFooterItemProps): JSX.Element => {
    return (
        <ListItem sx={{ width: 'auto' }}>
            <ListItemText primaryTypographyProps={{ component: Link, href, variant: 'button' }}>
                {children}
            </ListItemText>
        </ListItem>
    );
};

export const NavigationFooter = (): JSX.Element => {
    return (
        <Stack
            component={List}
            direction="row"
            flexWrap="wrap"
            gap={2}
            paddingInline={2}
            marginBlockStart="auto">
            <NavigationFooterItem href={links.feedbackForm}>Give Feedback</NavigationFooterItem>
            <NavigationFooterItem href={links.faqs}>FAQs</NavigationFooterItem>
            <NavigationFooterItem href={links.dataPolicy}>Data Policy</NavigationFooterItem>
            <NavigationFooterItem href={links.logOut}>Log Out</NavigationFooterItem>
        </Stack>
    );
};
