import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link, ListItem, ListItemButton, ListItemText, Stack } from '@mui/material';
import { useLocation, useParams } from 'react-router-dom';

const todayDateFormatter = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: 'numeric',
});
const pastWeekDateFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'long' });
const pastMonthDateFormatter = new Intl.DateTimeFormat(undefined, {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
});

const isCurrentDay = (date: Date): boolean => {
    const dateClone = new Date(date);

    return dateClone.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
};

const isPastWeek = (date: Date): boolean => {
    return new Date().getDate() - date.getDate() > 7 && new Date().getDate() - date.getDate() <= 30;
};
interface ThreadLinkProps {
    content: string;
    timeStamp: Date;
    href: string;
    threadId: string;
}
export const ThreadLink = ({ content, timeStamp, href, threadId }: ThreadLinkProps) => {
    const { id } = useParams();

    const isSelected = id === threadId;

    const displayTime = (): string => {
        if (isCurrentDay(timeStamp)) {
            return todayDateFormatter.format(timeStamp);
        } else if (isPastWeek(timeStamp)) {
            return pastWeekDateFormatter.format(timeStamp);
        }
        return pastMonthDateFormatter.format(timeStamp);
    };

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
