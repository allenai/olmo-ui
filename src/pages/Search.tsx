import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LinearProgress, Typography, useMediaQuery, useTheme } from '@mui/material';

import { RemoteState } from '../contexts/util';
import { search } from '../api/dolma/search';
import { SearchForm } from '../components/dolma/SearchForm';
import { SearchResultList } from '../components/dolma/SearchResultList';
import { ElevatedPaper, NoPaddingContainer } from '../components/dolma/shared';
import { AnalyticsClient } from '../api/dolma/AnalyticsClient';
import { useAppContext } from '../AppContext';

import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';

export const Search = () => {
    const loc = useLocation();
    const request = search.fromQueryString(loc.search);

    const doSearch = useAppContext((state) => state.doSearch);
    const searchState = useAppContext((state) => state.searchState);
    const response = useAppContext((state) => state.searchResponse);
    const error = useAppContext((state) => state.searchError);

    const theme = useTheme();
    const isDesktopOrUp = useMediaQuery(theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT));

    useEffect(() => {
        doSearch(request).then((r) => {
            const analytics = new AnalyticsClient();
            analytics.trackSearchQuery({ request, response: { meta: r.meta } });
        });
    }, [search.toQueryString(request)]);

    const SearchWrapper = isDesktopOrUp ? ElevatedPaper : NoPaddingContainer;

    if (searchState === RemoteState.Loaded && !response) {
        throw new Error('No response');
    }

    return (
        <>
            <SearchWrapper>
                <SearchForm
                    defaultValue={request.query}
                    noCard={isDesktopOrUp}
                    disabled={searchState === RemoteState.Loading}
                />
                {searchState === RemoteState.Error && (
                    <SearchError message={error?.message ?? 'Unexpected Error'} />
                )}
                {searchState === RemoteState.Loaded && response && (
                    <SearchResultList response={response} />
                )}
            </SearchWrapper>
            {searchState === RemoteState.Loading && <LinearProgress sx={{ mt: 3 }} />}
        </>
    );
};

const SearchError = ({ message }: { message: string }) => (
    <NoPaddingContainer>
        <h4>Something went wrong</h4>
        <Typography component="h4">Something went wrong</Typography>
        <Typography component="body">{message}</Typography>
    </NoPaddingContainer>
);
