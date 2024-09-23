import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link, ListItem, ListItemButton, ListItemText } from '@mui/material';
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
                    color: (theme) => theme.palette.common.white,
                    '&.Mui-selected': {
                        backgroundColor: (theme) => theme.palette.tertiary.light,
                        color: (theme) => theme.palette.text.primary,
                        fontWeight: 'normal',

                        '&:hover': {
                            backgroundColor: (theme) => theme.palette.tertiary.light,
                            color: (theme) => theme.palette.text.primary,
                            fontWeight: 'normal',
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

                <ListItemText
                    sx={{ marginInlineStart: 'auto', flex: '0 0 auto' }}
                    primaryTypographyProps={{
                        variant: 'caption',
                        color: 'inherit',
                        fontWeight: 'bold',
                        sx: { margin: 0, fontVariantNumeric: 'tabular-nums' },
                    }}>
                    <TimeDisplay timeStamp={created} />
                </ListItemText>
                <ChevronRightIcon />
            </ListItemButton>
        </ListItem>
    );
};
