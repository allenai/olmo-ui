import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    CircularProgress,
    Divider,
    IconButton,
    ListItem,
    ListItemText,
    ListSubheader,
    Stack,
    Typography,
} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { KeyboardEventHandler, useEffect, useState } from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';

import { Message } from '@/api/Message';
import { useAppContext } from '@/AppContext';
import { ResponsiveDrawer } from '@/components/ResponsiveDrawer';
import { RemoteState } from '@/contexts/util';
import { DrawerId } from '@/slices/DrawerSlice';
import { isCurrentDay, isPastWeek } from '@/utils/date-utils';
import { useCloseDrawerOnNavigation } from '@/utils/useClosingDrawerOnNavigation-utils';

import { HistoryDrawerSection } from './HistoryDrawerSection';

const LIMIT = 10;
const PAGE_SIZE = 10;

export const HISTORY_DRAWER_ID: DrawerId = 'history';

export const HistoryDrawer = (): JSX.Element => {
    const closeDrawer = useAppContext((state) => state.closeDrawer);
    const userInfo = useAppContext((state) => state.userInfo);
    const getMessageList = useAppContext((state) => state.getMessageList);
    const messageListState = useAppContext((state) => state.messageListState);
    const allThreads = useAppContext((state) => state.allThreads);
    const handleDrawerClose = () => {
        closeDrawer(HISTORY_DRAWER_ID);
    };
    const hasMoreThreadsToFetch = useAppContext((state) => {
        const totalThreadsOnServer = state.messageList.meta.total;
        const loadedThreadCount = state.allThreads.length;

        return totalThreadsOnServer !== 0 && loadedThreadCount < totalThreadsOnServer;
    });
    const isDrawerOpen = useAppContext((state) => state.currentOpenDrawer === HISTORY_DRAWER_ID);
    const [offset, setOffSet] = useState(0);
    const creator = userInfo?.client;

    useEffect(() => {
        if (creator) {
            getMessageList(offset, creator, LIMIT);
        }
    }, [creator]);

    const threadsFromToday: Message[] = [];
    const threadsFromThisWeek: Message[] = [];
    const threadsOlderThanAWeek: Message[] = [];

    allThreads.forEach((m) => {
        if (isCurrentDay(m.created)) {
            threadsFromToday.push(m);
        } else if (isPastWeek(m.created)) {
            threadsFromThisWeek.push(m);
        } else {
            threadsOlderThanAWeek.push(m);
        }
    });

    const handleScroll = () => {
        if (messageListState !== RemoteState.Loading) {
            getMessageList(offset + PAGE_SIZE, creator, LIMIT);
            setOffSet(offset + PAGE_SIZE);
        }
    };

    const onKeyDownEscapeHandler: KeyboardEventHandler = (
        event: React.KeyboardEvent<HTMLDivElement>
    ) => {
        if (event.key === 'Escape') {
            handleDrawerClose();
        }
    };

    const [sentryRef, { rootRef }] = useInfiniteScroll({
        loading: messageListState === RemoteState.Loading,
        hasNextPage: hasMoreThreadsToFetch,
        onLoadMore: handleScroll,
        disabled: messageListState === RemoteState.Error,
        delayInMs: 100,
    });

    useCloseDrawerOnNavigation({
        handleDrawerClose,
    });

    return (
        <ResponsiveDrawer
            onClose={handleDrawerClose}
            onKeyDownHandler={onKeyDownEscapeHandler}
            open={isDrawerOpen}
            anchor="left"
            desktopDrawerVariant="temporary"
            heading={
                <Box
                    sx={{
                        position: 'sticky',
                        paddingInline: (theme) => theme.spacing(2),
                        paddingBlock: (theme) => theme.spacing(4),
                        backgroundColor: 'inherit',
                    }}>
                    <Stack
                        justifyContent="space-between"
                        direction="row"
                        gap={2}
                        alignItems="center">
                        <ListSubheader sx={{ backgroundColor: 'transparent', padding: 0 }}>
                            <Typography variant="h3" margin={0} color="primary">
                                Thread History
                            </Typography>
                        </ListSubheader>
                        <IconButton
                            onClick={handleDrawerClose}
                            sx={{ color: (theme) => theme.palette.common.white }}
                            aria-label="close history drawer">
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                    <Divider />
                </Box>
            }
            desktopDrawerSx={{ gridArea: 'nav', width: (theme) => theme.spacing(40) }}>
            <Stack direction="column" ref={rootRef} sx={{ overflowY: 'auto' }}>
                <HistoryDrawerSection heading="Today" threads={threadsFromToday} />
                <HistoryDrawerSection
                    heading="Previous 7 Days"
                    threads={threadsFromThisWeek}
                    hasDivider
                />
                <HistoryDrawerSection
                    heading="Older Than A Week"
                    threads={threadsOlderThanAWeek}
                    hasDivider
                />
                {(hasMoreThreadsToFetch || messageListState === RemoteState.Loading) && (
                    <CircularProgress
                        sx={{
                            color: (theme) => theme.palette.secondary.light,
                            marginLeft: (theme) => theme.spacing(3),
                        }}
                    />
                )}
                {(hasMoreThreadsToFetch || messageListState === RemoteState.Loaded) && (
                    <ListItem ref={sentryRef}>
                        <ListItemText
                            sx={{ marginInlineStart: 'auto', flex: '0 0 auto', width: 1 }}
                            primaryTypographyProps={{
                                variant: 'caption',
                                color: 'inherit',
                                fontWeight: 'bold',
                                sx: { margin: 0, fontVariantNumeric: 'tabular-nums' },
                            }}>
                            <Skeleton animation="wave" variant="text" />
                        </ListItemText>
                    </ListItem>
                )}
            </Stack>
        </ResponsiveDrawer>
    );
};
