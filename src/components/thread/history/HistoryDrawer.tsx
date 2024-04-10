import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    Divider,
    IconButton,
    ListItem,
    ListSubheader,
    Stack,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';

import { useAppContext } from '@/AppContext';
import { Message } from '@/api/Message';
import { ResponsiveDrawer } from '@/components/ResponsiveDrawer';
import { DrawerId } from '@/slices/DrawerSlice';
import { HistoryDrawerSection } from './HistoryDrawerSection';

const Limit = 20 as const;

export const HISTORY_DRAWER_ID: DrawerId = 'history' as const;

export const HistoryDrawer = (): JSX.Element => {
    const closeDrawer = useAppContext((state) => state.closeDrawer);
    const userInfo = useAppContext((state) => state.userInfo);
    const getAllThreads = useAppContext((state) => state.getAllThreads);
    const allThreadInfo = useAppContext((state) => state.allThreadInfo);
    const threads = useAppContext((state) => state.threads);
    const handleDrawerClose = () => closeDrawer(HISTORY_DRAWER_ID);

    const isDrawerOpen = useAppContext((state) => state.currentOpenDrawer === HISTORY_DRAWER_ID);
    const [offset, setOffSet] = useState(10);
    const creator = userInfo?.client;

    useEffect(() => {
        getAllThreads(offset, creator, Limit);
    }, [userInfo]);

    const threadsFromToday: Message[] = [];
    const threadsFromThisWeek: Message[] = [];
    const threadsOlderThanAWeek: Message[] = [];

    threads.forEach((m) => {
        const createdDay = m.created;
        if (createdDay.toDateString() === new Date().toDateString()) {
            threadsFromToday.push(m);
        } else if (
            new Date().getDate() - createdDay.getDate() > 7 &&
            new Date().getDate() - createdDay.getDate() <= 30
        ) {
            threadsFromThisWeek.push(m);
        } else {
            threadsOlderThanAWeek.push(m);
        }
    });

    const handleScroll = () => {
        if (!allThreadInfo.loading) {
            getAllThreads(offset + 20, creator, Limit);
            setOffSet(offset + 20);
        }
    };

    const [sentryRef] = useInfiniteScroll({
        loading: allThreadInfo.loading ? allThreadInfo.loading : false,
        hasNextPage: threads.length > 0,
        onLoadMore: handleScroll,
        // When there is an error, we stop infinite loading.
        // It can be reactivated by setting "error" state as undefined.
        disabled: !!allThreadInfo.error,
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
                        backgroundColor: (theme) => theme.palette.background.paper,
                    }}>
                    <Stack justifyContent="space-between" direction="row" gap={2}>
                        <ListSubheader sx={{ paddingBlock: 2, backgroundColor: 'transparent' }}>
                            <Typography variant="h5" margin={0} color="primary">
                                History
                            </Typography>
                        </ListSubheader>
                        <IconButton
                            onClick={handleDrawerClose}
                            sx={{ verticalAlign: 'middle', display: 'inline-flex' }}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                    <Divider />
                </Box>
            }
            desktopDrawerSx={{ gridArea: 'side-drawer' }}>
            <Stack direction="column" ref={sentryRef} sx={{ overflow: 'scroll' }}>
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
                {/* {(loading || hasNextPage) && (
                    <ListItem ref={sentryRef}>
                        <Typography>Loading... </Typography>
                    </ListItem>
                )} */}
            </Stack>
        </ResponsiveDrawer>
    );
};
