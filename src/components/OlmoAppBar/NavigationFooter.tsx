import { List, ListItem, ListItemText, Stack } from '@mui/material';
import { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

interface NavigationFooterItemProps extends PropsWithChildren {
    to: string;
}

const NavigationFooterItem = ({ to, children }: NavigationFooterItemProps): JSX.Element => {
    return (
        <ListItem sx={{ width: 'auto' }}>
            <ListItemText primaryTypographyProps={{ component: Link, to, variant: 'button' }}>
                {children}
            </ListItemText>
        </ListItem>
    );
};

const FeedbackFormUrl =
    'https://docs.google.com/forms/d/e/1FAIpQLSfmPUnxBss08X8aq7Aiy17YSPhH-OqHzHMIzXg4zsIhAbvqxg/viewform?usp=sf_link' as const;

export const NavigationFooter = () => {
    return (
        <Stack
            component={List}
            direction="row"
            flexWrap="wrap"
            gap={2}
            sx={{ marginBlockStart: 'auto', paddingInline: 2 }}>
            <NavigationFooterItem to={FeedbackFormUrl}>Give Feedback</NavigationFooterItem>
            <NavigationFooterItem to="/faqs">FAQs</NavigationFooterItem>
            <NavigationFooterItem to="/data-policy">Data Policy</NavigationFooterItem>
            <NavigationFooterItem to="/log-out">Log Out</NavigationFooterItem>
        </Stack>
    );
};
