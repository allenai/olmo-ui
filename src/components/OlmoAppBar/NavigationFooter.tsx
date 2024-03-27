import { Link, List, ListItem, ListItemText, Stack } from '@mui/material';
import { PropsWithChildren } from 'react';

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

const FeedbackFormUrl =
    'https://docs.google.com/forms/d/e/1FAIpQLSfmPUnxBss08X8aq7Aiy17YSPhH-OqHzHMIzXg4zsIhAbvqxg/viewform?usp=sf_link' as const;

export const NavigationFooter = (): JSX.Element => {
    return (
        <Stack
            component={List}
            direction="row"
            flexWrap="wrap"
            gap={2}
            sx={{ marginBlockStart: 'auto', paddingInline: 2 }}>
            <NavigationFooterItem href={FeedbackFormUrl}>Give Feedback</NavigationFooterItem>
            <NavigationFooterItem href="/faqs">FAQs</NavigationFooterItem>
            <NavigationFooterItem href="/data-policy">Data Policy</NavigationFooterItem>
            <NavigationFooterItem href="/log-out">Log Out</NavigationFooterItem>
        </Stack>
    );
};
