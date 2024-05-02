import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    Divider,
    IconButton,
    ListItem,
    ListSubheader,
    Stack,
    Typography,
    ListItemText,
} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { useEffect, useState } from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';

import { useAppContext } from '@/AppContext';
import { Message } from '@/api/Message';
import { ResponsiveDrawer } from '@/components/ResponsiveDrawer';
import { DrawerId } from '@/slices/DrawerSlice';
import { HistoryDrawerSection } from './HistoryDrawerSection';

import { isCurrentDay, isPastWeek } from '@/utils/date-utils';

const LIMIT = 10;
const PAGE_SIZE = 10;

export const HISTORY_DRAWER_ID: DrawerId = 'history';

export const HistoryDrawer = (): JSX.Element => {
    const closeDrawer = useAppContext((state) => state.closeDrawer);
    const userInfo = useAppContext((state) => state.userInfo);
    const getAllThreads = useAppContext((state) => state.getAllThreads);
    const allThreadInfo = useAppContext((state) => state.allThreadInfo);
    const threads = useAppContext((state) => state.threads);
    const handleDrawerClose = () => {
        closeDrawer(HISTORY_DRAWER_ID);
    };
    const hasMoreThreadsToFetch = useAppContext((state) => {
        const totalThreadsOnServer = state.allThreadInfo.data.meta.total;
        const loadedThreadCount = state.threads.length;

        return totalThreadsOnServer !== 0 && loadedThreadCount < totalThreadsOnServer;
    });

    const isDrawerOpen = useAppContext((state) => state.currentOpenDrawer === HISTORY_DRAWER_ID);
    const [offset, setOffSet] = useState(0);
    const creator = userInfo?.client;

    useEffect(() => {
        if (creator) {
            getAllThreads(offset, creator, LIMIT);
        }
    }, [creator]);

    const threadsFromToday: Message[] = [];
    const threadsFromThisWeek: Message[] = [];
    const threadsOlderThanAWeek: Message[] = [];

    threads.forEach((m) => {
        if (isCurrentDay(m.created)) {
            threadsFromToday.push(m);
        } else if (isPastWeek(m.created)) {
            threadsFromThisWeek.push(m);
        } else {
            threadsOlderThanAWeek.push(m);
        }
    });

    const handleScroll = () => {
        if (!allThreadInfo.loading) {
            getAllThreads(offset + PAGE_SIZE, creator, LIMIT);
            setOffSet(offset + PAGE_SIZE);
        }
    };

    const [sentryRef, { rootRef }] = useInfiniteScroll({
        loading: allThreadInfo.loading,
        hasNextPage: hasMoreThreadsToFetch,
        onLoadMore: handleScroll,
        disabled: allThreadInfo.error,
        delayInMs: 100,
    });

    return (
        <ResponsiveDrawer
            onClose={handleDrawerClose}
            open={isDrawerOpen}
            anchor="right"
            desktopDrawerVariant="persistent"
            heading={
                <Box
                    sx={{
                        position: 'sticky',
                        top: 0,
                        backgroundColor: (theme) => theme.palette.background.default,
                    }}>
                    <Stack
                        justifyContent="space-between"
                        direction="row"
                        gap={2}
                        alignItems="center">
                        <ListSubheader sx={{ paddingBlock: 2, backgroundColor: 'transparent' }}>
                            <Typography variant="h5" margin={0} color="primary">
                                History
                            </Typography>
                        </ListSubheader>
                        <IconButton
                            onClick={handleDrawerClose}
                            sx={{ color: 'inherit' }}
                            data-testid="Close History Drawer">
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                    <Divider />
                </Box>
            }
            desktopDrawerSx={{ gridArea: 'side-drawer' }}>
            <Stack direction="column" ref={rootRef} sx={{ overflowY: 'scroll' }}>
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
                {(hasMoreThreadsToFetch || allThreadInfo.loading) && (
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
