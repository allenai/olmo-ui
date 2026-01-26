import { ChatOutlined as ChatIcon } from '@mui/icons-material';
import { Link, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useParams } from 'react-router-dom';

import { links } from '../Links';
import { formatDateForHistory } from '../utils/formatDateForHistory';
import { AgentIcon } from './assets/AgentIcon';
import { ChevronIcon } from './assets/ChevronIcon';
import { DeleteThreadIconButton } from './thread/DeleteThreadButton';

export interface ThreadLinkProps {
    threadId: string;
    agentId?: string;
    content?: string;
    creator: string;
    createdDate: Date;
    handleDelete: () => void;
}

export const ThreadLink = ({
    threadId,
    agentId,
    content = 'message...',
    creator,
    createdDate,
    handleDelete,
}: ThreadLinkProps) => {
    const { id: idParameter } = useParams();
    const isSelected = idParameter === threadId;

    return (
        <ListItem
            disablePadding
            sx={{
                color: (theme) => theme.palette.text.drawer.primary,
                position: 'relative',
                minHeight: (theme) => theme.spacing(5),
                '& .MuiIconButton-root': {
                    opacity: 0,
                    transition: '300ms opacity ease-in-out',
                    '&.Mui-focusVisible': {
                        opacity: 1,
                    },
                },
            }}
            secondaryAction={
                <DeleteThreadIconButton
                    creator={creator}
                    createdDate={createdDate}
                    onClick={handleDelete}
                />
            }>
            <ListItemButton
                alignItems="center"
                selected={isSelected}
                title={formatDateForHistory(createdDate)}
                sx={{
                    minHeight: (theme) => theme.spacing(5),
                    gap: (theme) => theme.spacing(1),
                    '&.Mui-selected': {
                        backgroundColor: (theme) => theme.palette.secondary.light,
                        color: (theme) => theme.color['dark-teal-100'].hex,
                        '&:hover': {
                            backgroundColor: (theme) => theme.palette.secondary.light,
                            color: (theme) => theme.color['dark-teal-100'].hex,
                        },
                    },
                    '&&.Mui-focusVisible': (theme) => ({
                        backgroundColor: theme.palette.secondary.light,
                        color: theme.color['dark-teal-100'].hex,
                    }),
                    '& .MuiListItemIcon-root': {
                        fontSize: '1rem',
                        color: 'inherit',
                        opacity: 0.5,
                        minWidth: '1rem',
                    },
                }}
                component={Link}
                href={links.thread(threadId)}>
                <ListItemIcon>
                    {agentId ? <AgentIcon fontSize="inherit" /> : <ChatIcon fontSize="inherit" />}
                </ListItemIcon>
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
