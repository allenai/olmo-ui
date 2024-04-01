import { Button, Divider, IconButton, List, Stack } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';

import { useSearchParams } from 'react-router-dom';

import { ResponsiveDrawer } from './ResponsiveDrawer';
import { useAppContext } from '../AppContext';
import { NavigationHeading } from './OlmoAppBar/NavigationHeading';
import { ThreadLink } from '../components/ThreadLink';
import { Message } from '../api/Message';

export const HistoryButton = () => {
    const userInfo = useAppContext((state) => state.userInfo);
    const getAllThreads = useAppContext((state) => state.getAllThreads);
    const allThreadInfo = useAppContext((state) => state.allThreadInfo);

    const [pageParams] = useSearchParams();
    const page = Number(pageParams.get('page') ?? '1');

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

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
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
                }
                desktopDrawerSx={{ gridArea: 'side-drawer' }}>
                <Stack component="nav" direction="column" justifyContent="space-between" height="1">
                    <List>
                        <NavigationHeading>Today</NavigationHeading>
                        {threadsFromToday &&
                            threadsFromToday.map((thread) => (
                                <ThreadLink {...thread} key={thread.id} />
                            ))}
                    </List>
                    <Divider />
                    <List>
                        <NavigationHeading>Previous 7 Days</NavigationHeading>
                        {threadsFromThisWeek &&
                            threadsFromThisWeek.map((thread) => (
                                <ThreadLink {...thread} key={thread.id} />
                            ))}
                    </List>
                    <Divider />
                    <List>
                        <NavigationHeading>Previous 30 Days</NavigationHeading>
                        {threadsFromThisMonth &&
                            threadsFromThisMonth.map((thread) => (
                                <ThreadLink {...thread} key={thread.id} />
                            ))}
                    </List>
                </Stack>
            </ResponsiveDrawer>
        </>
    );
};
