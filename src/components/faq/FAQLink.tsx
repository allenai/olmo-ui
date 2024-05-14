import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface FAQLinkProps {
    content: string;
    id: string;
}
export const FAQLink = ({ content, id }: FAQLinkProps) => {
    const { hash } = useLocation();
    const [isSelected, setIsSelected] = useState(false);

    useEffect(() => {
        const hashValue = hash.slice(1, hash.length);
        setIsSelected(hashValue === id);
    }, [hash]);

    return (
        <ListItem disableGutters>
            <ListItemButton
                alignItems="center"
                selected={isSelected}
                sx={{
                    gap: (theme) => theme.spacing(1),
                }}
                component="a"
                href={'#' + id}>
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
