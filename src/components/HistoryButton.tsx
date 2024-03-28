import { Button, Divider, IconButton, List, Stack } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';

import { ResponsiveDrawer } from './ResponsiveDrawer';
import { useAppContext } from '../AppContext';
import { NavigationHeading } from './OlmoAppBar/NavigationHeading';
import { ThreadLink } from './OlmoAppBar/ThreadLink';
import { Message } from '../api/Message';

export const HistoryButton = () => {
    const userInfo = useAppContext((state) => state.userInfo);
    const getAllThreads = useAppContext((state) => state.getAllThreads);
    const allThreadInfo = useAppContext((state) => state.allThreadInfo);
    const loc = useLocation();
    const qs = new URLSearchParams(loc.search);
    const p = parseInt(qs.get('page') ?? '');
    const page = isNaN(p) ? 1 : p;

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };

    const size = 10;

    useEffect(() => {
        const creator = userInfo?.data?.client;
        const offset = (page - 1) * size;
        getAllThreads(offset, creator);
    }, [userInfo, page, size]);

    const [todayThread, setTodayThread] = useState<Message[]>([]);
    const [pastSevenDaysThread, setPastSevenDaysThread] = useState<Message[]>([]);
    const [pastThirtyDaysThread, setPastThirtyDaysThread] = useState<Message[]>([]);

    useEffect(() => {
        if (!allThreadInfo.loading && !allThreadInfo.error && allThreadInfo.data) {
            const tempToday: Message[] = [];
            const tempPastSevenDays: Message[] = [];
            const tempPastThirtyDays: Message[] = [];
            allThreadInfo.data.messages.forEach((m) => {
                const createdDay = m.created;
                if (createdDay.toDateString() === new Date().toDateString()) {
                    tempToday.push(m);
                } else if (
                    new Date().getDate() - createdDay.getDate() > 7 &&
                    new Date().getDate() - createdDay.getDate() <= 30
                ) {
                    tempPastSevenDays.push(m);
                } else {
                    tempPastThirtyDays.push(m);
                }
            });
            setTodayThread(tempToday);
            setPastSevenDaysThread(tempPastSevenDays);
            setPastThirtyDaysThread(tempPastThirtyDays);
        }
    }, [allThreadInfo]);

    const toggleDrawer = () => {
        setIsDrawerOpen(true);
    };

    return (
        <>
            <Button
                component="label"
                variant="contained"
                tabIndex={-1}
                startIcon={<HistoryIcon />}
                onClick={toggleDrawer}
                disabled={allThreadInfo.loading || allThreadInfo.error}>
                History
            </Button>
            {!allThreadInfo.loading && !allThreadInfo.error && allThreadInfo.data ? (
                <ResponsiveDrawer
                    onClose={handleDrawerClose}
                    open={isDrawerOpen}
                    anchor="right"
                    desktopDrawerVariant="persistent"
                    desktopHeading={
                        <Stack justifyContent="space-between" direction="row" gap={2}>
                            <NavigationHeading>History</NavigationHeading>
                            <IconButton
                                onClick={handleDrawerClose}
                                sx={{ verticalAlign: 'middle', display: 'inline-flex' }}>
                                <CloseIcon />
                            </IconButton>
                        </Stack>
                    }>
                    <Stack
                        component="nav"
                        direction="column"
                        justifyContent="space-between"
                        height="1">
                        <List>
                            <NavigationHeading>Today</NavigationHeading>
                            {todayThread.map((t, index) => (
                                <ThreadLink
                                    href={`/thread/${t.id}`}
                                    content={t.content}
                                    timeStamp={t.created}
                                    key={index}
                                />
                            ))}
                        </List>
                        <Divider />
                        <List>
                            <NavigationHeading>Previous 7 Days</NavigationHeading>
                            {pastSevenDaysThread.map((pS, index) => (
                                <ThreadLink
                                    href={`/thread/${pS.id}`}
                                    content={pS.content}
                                    timeStamp={pS.created}
                                    key={index}
                                />
                            ))}
                        </List>
                        <Divider />
                        <List>
                            <NavigationHeading>Previous 30 Days</NavigationHeading>
                            {pastThirtyDaysThread.map((pT, index) => (
                                <ThreadLink
                                    href={`/thread/${pT.id}`}
                                    content={pT.content}
                                    timeStamp={pT.created}
                                    key={index}
                                />
                            ))}
                        </List>
                    </Stack>
                </ResponsiveDrawer>
            ) : null}
        </>
    );
};
