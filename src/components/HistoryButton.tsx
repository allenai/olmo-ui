import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import { Divider, IconButton, List, Stack } from '@mui/material';
import { useEffect } from 'react';

import { useSearchParams } from 'react-router-dom';

import { DrawerId } from '@/slices/DrawerSlice';
import { useAppContext } from '../AppContext';
import { Message } from '../api/Message';
import { ThreadLink } from '../components/ThreadLink';
import { NavigationHeading } from './OlmoAppBar/NavigationHeading';
import { ResponsiveDrawer } from './ResponsiveDrawer';
import { ResponsiveButton } from './thread/ResponsiveButton';

export const HistoryButton = () => {
    const isButtonDisabled = useAppContext(
        (state) => state.allThreadInfo.loading || state.allThreadInfo.error
    );
    const toggleDrawer = useAppContext((state) => state.toggleDrawer);
    const toggleHistoryDrawer = () => toggleDrawer(HistoryDrawerId);

    return (
        <ResponsiveButton
            variant="outlined"
            startIcon={<HistoryIcon />}
            title="History"
            onClick={toggleHistoryDrawer}
            disabled={isButtonDisabled}
        />
    );
};

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
        const creator = userInfo?.data?.client;
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

interface HistorySectionProps {
    heading: string;
    threads: Message[];
    hasDivider?: boolean;
}

const HistorySection = ({ heading, threads, hasDivider }: HistorySectionProps): JSX.Element => {
    if (threads.length === 0) {
        return <></>;
    }

    return (
        <>
            {hasDivider && <Divider />}
            <List>
                <NavigationHeading>{heading}</NavigationHeading>
                {threads.map((thread) => (
                    <ThreadLink {...thread} key={thread.id} />
                ))}
            </List>
        </>
    );
};

const HistoryDrawerId: DrawerId = 'history' as const;

export const HistoryDrawer = (): JSX.Element => {
    const closeDrawer = useAppContext((state) => state.closeDrawer);
    const handleDrawerClose = () => closeDrawer(HistoryDrawerId);

    const isDrawerOpen = useAppContext((state) => state.currentOpenDrawer === HistoryDrawerId);

    const { threadsFromToday, threadsFromThisWeek, threadsFromThisMonth } =
        useGroupedThreadHistory();

    return (
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
            <Stack component="nav" direction="column">
                <HistorySection heading="Today" threads={threadsFromToday} />
                <HistorySection
                    heading="Previous 7 Days"
                    threads={threadsFromThisWeek}
                    hasDivider
                />
                <HistorySection
                    heading="Previous 30 Days"
                    threads={threadsFromThisMonth}
                    hasDivider
                />
            </Stack>
        </ResponsiveDrawer>
    );
};
