import CloseIcon from '@mui/icons-material/Close';
import { Box, Divider, IconButton, ListSubheader, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';

import { useSearchParams } from 'react-router-dom';

import { useAppContext } from '@/AppContext';
import { Message } from '@/api/Message';
import { ResponsiveDrawer } from '@/components/ResponsiveDrawer';
import { DrawerId } from '@/slices/DrawerSlice';
import { HistoryDrawerSection } from './HistoryDrawerSection';

const DefaultPageSize = 10 as const;

const useGroupedThreadHistory = (): {
    threadsFromToday: Message[];
    threadsFromThisWeek: Message[];
    threadsFromThisMonth: Message[];
} => {
    const userInfo = useAppContext((state) => state.userInfo);
    const getAllThreads = useAppContext((state) => state.getAllThreads);
    const allThreadInfo = useAppContext((state) => state.allThreadInfo);

    const [pageParams] = useSearchParams();
    const page = Number(pageParams.get('page') ?? '1');

    useEffect(() => {
        const creator = userInfo?.client;
        const offset = (page - 1) * DefaultPageSize;
        getAllThreads(offset, creator);
    }, [userInfo, page]);

    const threadsFromToday: Message[] = [];
    const threadsFromThisWeek: Message[] = [];
    const threadsFromThisMonth: Message[] = [];

    allThreadInfo.data?.messages.forEach((m) => {
        const createdDay = m.created;

        if (createdDay.toDateString() === new Date().toDateString()) {
            threadsFromToday.push(m);
        } else if (
            new Date().getDate() - createdDay.getDate() > 7 &&
            new Date().getDate() - createdDay.getDate() <= 30
        ) {
            threadsFromThisWeek.push(m);
        } else {
            threadsFromThisMonth.push(m);
        }
    });

    return { threadsFromToday, threadsFromThisWeek, threadsFromThisMonth };
};

export const HISTORY_DRAWER_ID: DrawerId = 'history' as const;

export const HistoryDrawer = (): JSX.Element => {
    const closeDrawer = useAppContext((state) => state.closeDrawer);
    const handleDrawerClose = () => closeDrawer(HISTORY_DRAWER_ID);

    const isDrawerOpen = useAppContext((state) => state.currentOpenDrawer === HISTORY_DRAWER_ID);

    const { threadsFromToday, threadsFromThisWeek, threadsFromThisMonth } =
        useGroupedThreadHistory();

    return (
        <ResponsiveDrawer
            onClose={handleDrawerClose}
            open={isDrawerOpen}
            anchor="right"
            desktopDrawerVariant="persistent"
            heading={
                <Box sx={{ position: 'sticky', top: 0 }}>
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
            <Stack direction="column">
                <HistoryDrawerSection heading="Today" threads={threadsFromToday} />
                <HistoryDrawerSection
                    heading="Previous 7 Days"
                    threads={threadsFromThisWeek}
                    hasDivider
                />
                <HistoryDrawerSection
                    heading="Previous 30 Days"
                    threads={threadsFromThisMonth}
                    hasDivider
                />
            </Stack>
        </ResponsiveDrawer>
    );
};
