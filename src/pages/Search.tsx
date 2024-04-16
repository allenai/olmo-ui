import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LinearProgress, useMediaQuery, useTheme } from '@mui/material';

import { RemoteState } from '../contexts/util';
import { search } from '../api/dolma/search';
import { SearchForm } from '../components/dolma/SearchForm';
import { SearchResultList } from '../components/dolma/SearchResultList';
import { ElevatedPaper, NoPaddingContainer, NoPaddingGrid } from '../components/dolma/shared';
import { AnalyticsClient } from '../api/AnalyticsClient';
import { useAppContext } from '../AppContext';

import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';

const SearchError = ({ message }: { message: string }) => {
    return (
        <NoPaddingGrid>
            <h4>Something went wrong</h4>
            <p>{message}</p>
        </NoPaddingGrid>
    );
};

export const Search = () => {
    const loc = useLocation();
    const request = search.fromQueryString(loc.search);

    const doSearch = useAppContext((state) => state.doSearch);
    const searchState = useAppContext((state) => state.searchState);
    const response = useAppContext((state) => state.searchResponse);
    const error = useAppContext((state) => state.searchError);

    const analytics = new AnalyticsClient();
    const theme = useTheme();
    const isDesktopOrUp = useMediaQuery(theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT));

    useEffect(() => {
        doSearch(request).then((r) => {
            analytics.trackSearchQuery({ request, response: { meta: r.meta } });
        });
    }, [search.toQueryString(request)]);

    switch (searchState) {
        case RemoteState.Loading: {
            return (
                <NoPaddingContainer>
                    <SearchForm defaultValue={request.query} disabled={true} />
                    <LinearProgress sx={{ mt: 3 }} />
                </NoPaddingContainer>
            );
        }
        case RemoteState.Error: {
            return (
                <NoPaddingContainer>
                    <SearchForm defaultValue={request.query} noCard={!isDesktopOrUp} />
                    <SearchError message={error?.message ?? 'Unexpected Error'} />
                </NoPaddingContainer>
            );
        }
        case RemoteState.Loaded: {
            if (!response) {
                throw new Error('No response');
            }
            const SearchWrapper = isDesktopOrUp ? ElevatedPaper : NoPaddingContainer;
            return (
                <SearchWrapper>
                    <SearchForm defaultValue={request.query} noCard={isDesktopOrUp} />
                    <SearchResultList response={response} />
                </SearchWrapper>
            );
        }
    }
};
