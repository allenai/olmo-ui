import React, { useEffect } from 'react';
import {
    Grid,
    LinearProgress,
    ToggleButton,
    ToggleButtonGroup,
    Pagination,
    Stack,
} from '@mui/material';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

import { ThreadAccordionView } from './ThreadAccordionView';
import { ThreadBodyView } from './ThreadBodyView';
import { useAppContext } from '../AppContext';
import { ContextMenu } from './ContextMenu';
import { Message } from '../api/Message';
import { PrivateToggle } from './PrivateToggle';

enum QueryToggleOptions {
    All = 'all',
    Mine = 'mine',
}

interface QueriesHeaderProps {
    queriesView: string;
    onToggleChange: (
        _event: React.MouseEvent<HTMLElement>,
        queriesViewOption: string | null
    ) => void;
}

const QueriesHeader = (props: QueriesHeaderProps) => {
    return (
        <Grid container spacing={2}>
            <Grid item>
                <RecentQueriesHeading>Recent Queries</RecentQueriesHeading>
            </Grid>
            <Grid item>
                <PaddedButtonGroup
                    value={props.queriesView}
                    exclusive
                    onChange={props.onToggleChange}
                    aria-label="Toggle queries view">
                    <QueryToggleButton value={QueryToggleOptions.Mine} aria-label="My queries">
                        My Queries
                    </QueryToggleButton>
                    <QueryToggleButton value={QueryToggleOptions.All} aria-label="All queries">
                        All Queries
                    </QueryToggleButton>
                </PaddedButtonGroup>
            </Grid>
        </Grid>
    );
};

enum QueryStringParam {
    View = 'view',
    Page = 'page',
}

export const RecentQueries = () => {
    const { userInfo, getAllThreads, allThreadInfo, setExpandedThreadID, postMessageInfo } =
        useAppContext();
    const [isPrivateChecked, setIsPrivateChecked] = React.useState<boolean>(false);
    const loc = useLocation();
    const nav = useNavigate();
    const qs = new URLSearchParams(loc.search);
    const queriesView = qs.get(QueryStringParam.View) ?? QueryToggleOptions.Mine;

    const p = parseInt(qs.get(QueryStringParam.Page) ?? '');
    const page = isNaN(p) ? 1 : p;

    const onQueriesToggleChange = (
        _event: React.MouseEvent<HTMLElement>,
        queriesViewOption: string | null
    ) => {
        if (queriesViewOption !== null) {
            const qs = new URLSearchParams({ [QueryStringParam.View]: queriesViewOption });
            nav(`${loc.pathname}?${qs}`);
        }
    };

    const size = 10;
    const count = (() => {
        if (isPrivateChecked) {
            return allThreadInfo.data
                ? Math.ceil(
                      allThreadInfo.data?.messages.filter((message) => message.private === true)
                          .length / size
                  )
                : 0;
        }
        return allThreadInfo.data ? Math.ceil(allThreadInfo.data?.meta.total / size) : 0;
    })();

    useEffect(() => {
        const creator =
            queriesView === QueryToggleOptions.Mine ? userInfo?.data?.client : undefined;
        const offset = (page - 1) * size;
        getAllThreads(offset, creator);
    }, [queriesView, userInfo, page, size]);

    const onPrivateCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsPrivateChecked(event.target.checked);
    };

    const renderThread = (messages: Message[]) => {
        // if private queries being toggled we only render private queries only
        if (isPrivateChecked && queriesView !== 'all') {
            const privateQueries = messages.filter((message) => message.private === true);
            return (
                <>
                    {privateQueries.map((p) => (
                        <ThreadAccordionView
                            key={p.id}
                            title={p.content}
                            unformattedTitle={p.snippet}
                            body={
                                <ThreadBodyView
                                    messages={p.children}
                                    parent={p}
                                    showFollowUp={userInfo.data?.client === p.creator}
                                    disabledActions={postMessageInfo.loading}
                                />
                            }
                            rootMessage={p}
                            threadID={p.id}
                            threadCreator={p.creator}
                            showControls
                        />
                    ))}
                </>
            );
        }
        return (
            <>
                {messages.map((m) => (
                    <ThreadAccordionView
                        key={m.id}
                        title={m.content}
                        unformattedTitle={m.snippet}
                        body={
                            <ThreadBodyView
                                messages={m.children}
                                parent={m}
                                showFollowUp={userInfo.data?.client === m.creator}
                                disabledActions={postMessageInfo.loading}
                            />
                        }
                        rootMessage={m}
                        threadID={m.id}
                        threadCreator={m.creator}
                        showControls
                    />
                ))}
            </>
        );
    };

    return (
        <>
            <QueriesHeader queriesView={queriesView} onToggleChange={onQueriesToggleChange} />
            <PrivateToggle
                queriesView={queriesView}
                isPrivateChecked={isPrivateChecked}
                onPrivateCheckboxChange={onPrivateCheckboxChange}
            />
            <div>
                {allThreadInfo.loading ? <LinearProgress /> : null}
                {!allThreadInfo.loading && !allThreadInfo.error && allThreadInfo.data ? (
                    <Stack direction="column">
                        <ContextMenu>{renderThread(allThreadInfo.data.messages)}</ContextMenu>
                        {count > 1 ? (
                            <Stack alignItems="center">
                                <InvertedPagination
                                    boundaryCount={3}
                                    page={page}
                                    count={count}
                                    onChange={(_, page: number) => {
                                        const qs = new URLSearchParams(loc.search);
                                        qs.set(QueryStringParam.Page, `${page}`);
                                        nav(`${loc.pathname}?${qs}`);
                                        setExpandedThreadID(undefined);
                                    }}
                                />
                            </Stack>
                        ) : null}
                    </Stack>
                ) : null}
            </div>
        </>
    );
};

const RecentQueriesHeading = styled.h3`
    color: white;
`;

const QueryToggleButton = styled(ToggleButton)`
    &&& {
        &.Mui-selected {
            color: white;
        }
        &.Mui-selected:hover {
            color: white;
        }
        color: ${({ theme }) => theme.color2.N3};
    }
`;

const PaddedButtonGroup = styled(ToggleButtonGroup)`
    padding-top: ${({ theme }) => theme.spacing(4.5)};
`;

const InvertedPagination = styled(Pagination)`
    & .MuiPaginationItem-root {
        color: ${({ theme }) => theme.color2.N3};
    }

    && .Mui-selected {
        background-color: ${({ theme }) => theme.color2.N6};
        color: ${({ theme }) => theme.color2.N2};
    }
`;
