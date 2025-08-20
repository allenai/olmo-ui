import { Link, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useParams } from 'react-router-dom';

import { links } from '../Links';
import { formatDateForHistory } from '../utils/formatDateForHistory';
import { ChevronIcon } from './assets/ChevronIcon';
import { DeleteThreadIconButton } from './thread/DeleteThreadButton';

interface ThreadLinkProps {
    content: string;
    created: Date;
    id: string;
}

export const ThreadLink = ({ content, created, id }: ThreadLinkProps) => {
    const { id: idParameter } = useParams();

    const isSelected = idParameter === id;

    return (
        <ListItem
            disablePadding
            sx={{ position: 'relative', minHeight: (theme) => theme.spacing(5) }}
            secondaryAction={<DeleteThreadIconButton threadId={id} />}>
            <ListItemButton
                alignItems="center"
                selected={isSelected}
                title={formatDateForHistory(created)}
                sx={{
                    minHeight: (theme) => theme.spacing(5),
                    gap: (theme) => theme.spacing(1),
                    color: (theme) => theme.palette.text.drawer.primary,
                    '&.Mui-selected': {
                        backgroundColor: (theme) => theme.palette.secondary.light,
                        color: (theme) => theme.color['dark-teal-100'].hex,
                        fontWeight: 'normal',

                        '&:hover': {
                            backgroundColor: (theme) => theme.palette.secondary.light,
                            color: (theme) => theme.color['dark-teal-100'].hex,
                            fontWeight: 'normal',
                        },
                    },

                    '&.Mui-focusVisible': (theme) => ({
                        backgroundColor: theme.palette.secondary.light,
                        color: theme.color['dark-teal-100'].hex,
                    }),
                }}
                component={Link}
                href={links.thread(id)}>
                <ListItemText
                    primaryTypographyProps={{
                        variant: 'caption',
                        color: 'inherit',
                        sx: {
                            margin: 0,
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                        },
                    }}>
                    {content}
                </ListItemText>
            </ListItemButton>
            {isSelected && (
                <ChevronIcon
                    sx={(theme) => ({
                        position: 'absolute',
                        right: '6px',
                        top: '50%',
                        transform: 'translateY(-45%)', // visually center
                        color: theme.color['dark-teal-100'].hex,
                        width: theme.spacing(1.5),
                        height: theme.spacing(1.5),
                    })}
                />
            )}
        </ListItem>
    );
};
