import React, { useEffect } from 'react';
import { Grid, LinearProgress, ToggleButton, ToggleButtonGroup } from '@mui/material';
import styled from 'styled-components';

import { ThreadAccordianView } from './ThreadAccordianView';
import { ThreadBodyView } from './ThreadBodyView';
import { useAppContext } from '../AppContext';

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
                    <QueryToggleButton value={QueryToggleOptions.All} aria-label="All queries">
                        All Queries
                    </QueryToggleButton>
                    <QueryToggleButton value={QueryToggleOptions.Mine} aria-label="My queries">
                        My Queries
                    </QueryToggleButton>
                </PaddedButtonGroup>
            </Grid>
        </Grid>
    );
};

export const RecentQueries = () => {
    const [queriesView, setQueriesView] = React.useState<string>(QueryToggleOptions.Mine);
    const { userInfo, getAllThreads, allThreadInfo } = useAppContext();

    useEffect(() => {
        getAllThreads();
    }, []);

    const onQueriesToggleChange = (
        _event: React.MouseEvent<HTMLElement>,
        queriesViewOption: string | null
    ) => {
        if (queriesViewOption !== null) {
            setQueriesView(queriesViewOption);
        }
    };

    return (
        <>
            <QueriesHeader queriesView={queriesView} onToggleChange={onQueriesToggleChange} />
            <div>
                {allThreadInfo.loading ? <LinearProgress /> : null}
                {!allThreadInfo.loading && !allThreadInfo.error && allThreadInfo.data
                    ? allThreadInfo.data.map((t) => {
                          if (
                              queriesView === QueryToggleOptions.Mine &&
                              t.creator !== userInfo.data?.client
                          ) {
                              return null;
                          }
                          return (
                              <ThreadAccordianView
                                  key={t.id}
                                  defaultExpandedId={(allThreadInfo.data ?? [])[0].id}
                                  title={t.content}
                                  body={<ThreadBodyView messages={t.children} parent={t} />}
                                  threadKey={t.id}
                                  rootMessage={t}
                                  threadCreator={t.creator}
                                  showControls
                              />
                          );
                      })
                    : null}
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
