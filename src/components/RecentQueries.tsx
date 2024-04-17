import { useEffect } from 'react';
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
import { RemoteState } from '@/contexts/util';

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
    const userInfo = useAppContext((state) => state.userInfo);
    const getAllThreads = useAppContext((state) => state.getAllThreads);
    const allThreads = useAppContext((state) => state.allThreads);
    const threadRemoteState = useAppContext((state) => state.threadRemoteState);
    const threadUpdateRemoteState = useAppContext((state) => state.threadUpdateRemoteState);
    const setExpandedThreadID = useAppContext((state) => state.setExpandedThreadID);
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
    const count = Math.ceil(allThreads.meta.total / size);

    useEffect(() => {
        const creator = queriesView === QueryToggleOptions.Mine ? userInfo?.client : undefined;
        const offset = (page - 1) * size;
        getAllThreads(offset, creator);
    }, [queriesView, userInfo, page, size]);

    return (
        <>
            <QueriesHeader queriesView={queriesView} onToggleChange={onQueriesToggleChange} />
            <div>
                {threadRemoteState === RemoteState.Loading ? <LinearProgress /> : null}
                {threadRemoteState === RemoteState.Loaded ? (
                    <Stack direction="column">
                        <ContextMenu>
                            <>
                                {allThreads.messages.map((t) => (
                                    <ThreadAccordionView
                                        key={t.id}
                                        title={t.content}
                                        unformattedTitle={t.snippet}
                                        body={
                                            <ThreadBodyView
                                                messages={t.children}
                                                parent={t}
                                                showFollowUp={userInfo?.client === t.creator}
                                                disabledActions={
                                                    threadUpdateRemoteState === RemoteState.Loading
                                                }
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
