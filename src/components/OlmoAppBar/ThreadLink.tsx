import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link, ListItem, ListItemButton, ListItemText, Stack } from '@mui/material';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// extend dayjs with relativeTime plugin
dayjs.extend(relativeTime);

interface ThreadLinkProps {
    content: string;
    timeStamp: Date;
    href: string;
}
export const ThreadLink = ({ content, timeStamp, href }: ThreadLinkProps) => {
    const location = useLocation();

    const isCurrentLocation = location.pathname.startsWith(href);

    const displayTime = (): string => {
        const test = timeStamp.toDateString();
        const value = dayjs(test).fromNow();
        if (value === 'Today') {
            return dayjs(test).format('HH:mm');
        } else if (value.includes('ago')) {
            return timeStamp.toLocaleString('en-us', { weekday: 'long' });
        }
        return dayjs(test).format('MM/DD/YY');
    };

    return (
        <ListItem disableGutters>
            <ListItemButton
                alignItems="center"
                selected={isCurrentLocation}
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
                href={href}>
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
                        {displayTime()}
                    </ListItemText>
                    <ChevronRightIcon sx={{ marginInlineStart: 'auto' }} />
                </Stack>
            </ListItemButton>
        </ListItem>
    );
};
