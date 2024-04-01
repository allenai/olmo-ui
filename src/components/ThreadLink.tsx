import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link, ListItem, ListItemButton, ListItemText, Stack } from '@mui/material';
import { useParams } from 'react-router-dom';

import { links } from '../Links';

import { TimeDisplay } from './TimeDisplay';
interface ThreadLinkProps {
    content: string;
    created: Date;
    id: string;
}
export const ThreadLink = ({ content, created, id }: ThreadLinkProps) => {
    const { id: idParameter } = useParams();

    const isSelected = idParameter === id;

    return (
        <ListItem disableGutters>
            <ListItemButton
                alignItems="center"
                selected={isSelected}
                sx={{
                    gap: (theme) => theme.spacing(1),
                    '&.Mui-selected': {
                        backgroundColor: (theme) => theme.palette.primary.main,
                        color: (theme) => theme.palette.primary.contrastText,

                        '&:focus-visible,&:hover': {
                            backgroundColor: (theme) => theme.palette.primary.dark,
                        },
                    },
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

                <Stack direction="row" alignItems="center" gap={1}>
                    <ListItemText
                        primaryTypographyProps={{
                            variant: 'caption',
                            color: 'inherit',
                            sx: { margin: 0 },
                        }}>
                        <TimeDisplay timeStamp={created} />
                    </ListItemText>
                    <ChevronRightIcon sx={{ marginInlineStart: 'auto' }} />
                </Stack>
            </ListItemButton>
        </ListItem>
    );
};
