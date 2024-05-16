import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useLocation } from 'react-router-dom';

import { useAppContext } from '@/AppContext';

import { CATEGORY_DRAWER_ID } from './FAQDrawer';

interface FAQCategoryLinkProps {
    content: string;
    id: string;
}
export const FAQCategoryLink = ({ content, id }: FAQCategoryLinkProps) => {
    const { hash } = useLocation();
    const hashValue = hash.slice(1, hash.length);
    const closeDrawer = useAppContext((state) => state.closeDrawer);

    const handleDrawerClose = () => {
        closeDrawer(CATEGORY_DRAWER_ID);
    };

    return (
        <ListItem disableGutters>
            <ListItemButton
                alignItems="center"
                selected={hashValue === id}
                sx={{
                    gap: (theme) => theme.spacing(1),
                }}
                component="a"
                href={'#' + id}
                onClick={handleDrawerClose}>
                <ListItemText
                    primaryTypographyProps={{
                        variant: 'caption',
                        color: 'inherit',
                        fontWeight: 'bold',
                        sx: {
                            margin: 0,
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                        },
                    }}>
                    {content}
                </ListItemText>

                <ChevronRightIcon />
            </ListItemButton>
        </ListItem>
    );
};
