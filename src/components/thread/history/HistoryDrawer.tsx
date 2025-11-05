import { Close } from '@mui/icons-material';
import {
    Box,
    CircularProgress,
    IconButton,
    ListItem,
    ListItemText,
    ListSubheader,
    Stack,
    Typography,
} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { KeyboardEventHandler, ReactNode, useState } from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { useNavigate } from 'react-router-dom';

import { Role } from '@/api/Role';
import { useAppContext } from '@/AppContext';
import { ResponsiveDrawer } from '@/components/ResponsiveDrawer';
import { ThreadLinkProps } from '@/components/ThreadLink';
import { links } from '@/Links';
import { DrawerId } from '@/slices/DrawerSlice';
import { SnackMessageType } from '@/slices/SnackMessageSlice';
import { isCurrentDay, isPastWeek } from '@/utils/date-utils';
import { useCloseDrawerOnNavigation } from '@/utils/useClosingDrawerOnNavigation-utils';

import { DeleteThreadDialog } from '../DeleteThreadDialog';
import { HistoryDivider, HistoryDrawerSection } from './HistoryDrawerSection';
import { HistoryExpirationMessage } from './HistoryExpirationMessage';
import { invalidateThreadsCache, useDeleteThread, useThreads } from './useThreads';

export const HISTORY_DRAWER_ID: DrawerId = 'history';

export const HistoryDrawer = (): ReactNode => {
    const nav = useNavigate();
    const closeDrawer = useAppContext((state) => state.closeDrawer);
    const addSnackMessage = useAppContext((state) => state.addSnackMessage);
    const isDrawerOpen = useAppContext((state) => state.currentOpenDrawer === HISTORY_DRAWER_ID);

    const { mutateAsync: deleteThread } = useDeleteThread();
    const [threadToDelete, setThreadToDelete] = useState<string>();
    const handleConfirmDelete = async () => {
        if (threadToDelete) {
            await deleteThread(threadToDelete);
            setThreadToDelete(undefined);
            invalidateThreadsCache();
            nav(links.playground);
            addSnackMessage({
                id: `thread-delete-${new Date().getTime()}`.toLowerCase(),
                type: SnackMessageType.Brief,
                message: 'Thread Deleted',
            });
        }
    };
    const handleCancelDelete = () => {
        setThreadToDelete(undefined);
    };

    const { data, isPending, isFetchingNextPage, isError, hasNextPage, fetchNextPage } =
        useThreads();
    const threadList = data?.pages.flatMap((page) => page.threads);
    const history = (threadList ?? []).map((thread) => {
        const firstMessage = thread.messages[0];
        const firstUserMessage = thread.messages.find((message) => {
            return message.role === Role.User;
        });
        const createdDate = firstMessage.created ? new Date(firstMessage.created) : new Date();

        return {
            threadId: thread.id,
            agentId: firstMessage.agentId ?? undefined,
            content: firstUserMessage?.content,
            creator: firstMessage.creator,
            createdDate,
            handleDelete: () => {
                setThreadToDelete(thread.id);
            },
        } satisfies ThreadLinkProps;
    });

    const handleDrawerClose = () => {
        closeDrawer(HISTORY_DRAWER_ID);
    };

    const segmentedHistory = history.reduce(
        (acc, cur) => {
            if (isCurrentDay(cur.createdDate)) {
                acc.today.push(cur);
            } else if (isPastWeek(cur.createdDate)) {
                acc.thisWeek.push(cur);
            } else {
                acc.older.push(cur);
            }
            return acc;
        },
        {
            today: [] as ThreadLinkProps[],
            thisWeek: [] as ThreadLinkProps[],
            older: [] as ThreadLinkProps[],
        }
    );

    const onKeyDownEscapeHandler: KeyboardEventHandler = (
        event: React.KeyboardEvent<HTMLDivElement>
    ) => {
        if (event.key === 'Escape') {
            handleDrawerClose();
        }
    };

    const [sentryRef, { rootRef }] = useInfiniteScroll({
        loading: isPending,
        hasNextPage,
        disabled: isError,
        delayInMs: 100,
        onLoadMore: () => {
            void fetchNextPage();
        },
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
                        padding: 3,
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
                            sx={{
                                color: (theme) => theme.palette.text.drawer.primary,
                                opacity: 0.5,
                            }}
                            aria-label="close history drawer">
                            <Close />
                        </IconButton>
                    </Stack>
                </Box>
            }
            desktopDrawerSx={{ gridArea: 'nav', width: (theme) => theme.spacing(40) }}>
            <Stack direction="column" ref={rootRef} sx={{ overflowY: 'auto' }}>
                <HistoryExpirationMessage />
                <HistoryDrawerSection heading="Today" history={segmentedHistory.today} hasDivider />
                <HistoryDrawerSection
                    heading="Previous 7 Days"
                    history={segmentedHistory.thisWeek}
                    hasDivider
                />
                <HistoryDrawerSection
                    heading="Older Than A Week"
                    history={segmentedHistory.older}
                />
                {(hasNextPage || isFetchingNextPage) && (
                    <>
                        <HistoryDivider />
                        <CircularProgress
                            sx={{
                                color: (theme) => theme.palette.secondary.light,
                                marginLeft: (theme) => theme.spacing(3),
                            }}
                        />
                    </>
                )}
                {(hasNextPage || !isFetchingNextPage) && (
                    <>
                        <HistoryDivider />
                        <ListItem ref={sentryRef}>
                            <ListItemText
                                sx={{ marginInlineStart: 'auto', flex: '0 0 auto', width: 1 }}
                                primaryTypographyProps={{
                                    variant: 'caption',
                                    color: 'inherit',
                                    fontWeight: 'bold',
                                    sx: { margin: 0, fontVariantNumeric: 'tabular-nums' },
                                }}>
                                {hasNextPage && <Skeleton animation="wave" variant="text" />}
                            </ListItemText>
                        </ListItem>
                    </>
                )}
            </Stack>
            <DeleteThreadDialog
                open={Boolean(threadToDelete)}
                onCancel={handleCancelDelete}
                handleDeleteThread={handleConfirmDelete}
            />
        </ResponsiveDrawer>
    );
};
