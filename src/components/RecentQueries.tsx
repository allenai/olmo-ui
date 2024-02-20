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
    const count = allThreadInfo.data ? Math.ceil(allThreadInfo.data?.meta.total / size) : 0;

    useEffect(() => {
        const creator =
            queriesView === QueryToggleOptions.Mine ? userInfo?.data?.client : undefined;
        const offset = (page - 1) * size;
        getAllThreads(offset, creator);
    }, [queriesView, userInfo, page, size]);

    return (
        <>
            <QueriesHeader queriesView={queriesView} onToggleChange={onQueriesToggleChange} />
            <div>
                {allThreadInfo.loading ? <LinearProgress /> : null}
                {!allThreadInfo.loading && !allThreadInfo.error && allThreadInfo.data ? (
                    <Stack direction="column">
                        <ContextMenu>
                            <>
                                {allThreadInfo.data.messages.map((t) => (
                                    <ThreadAccordionView
                                        key={t.id}
                                        title={t.content}
                                        unformattedTitle={t.snippet}
                                        body={
                                            <ThreadBodyView
                                                messages={t.children}
                                                parent={t}
                                                showFollowUp={userInfo.data?.client === t.creator}
                                                disabledActions={postMessageInfo.loading}
                                            />
                                        }
                                        rootMessage={t}
                                        threadID={t.id}
                                        threadCreator={t.creator}
                                        showControls
                                    />
                                ))}
                            </>
                        </ContextMenu>
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
        color: ${({ theme }) => theme.color2.N3.hex};
    }
`;

const PaddedButtonGroup = styled(ToggleButtonGroup)`
    padding-top: ${({ theme }) => theme.spacing(4.5)};
`;

const InvertedPagination = styled(Pagination)`
    & .MuiPaginationItem-root {
        color: ${({ theme }) => theme.color2.N3.hex};
    }

    && .Mui-selected {
        background-color: ${({ theme }) => theme.color2.N5.hex};
        color: ${({ theme }) => theme.color2.N2.hex};
    }
`;
