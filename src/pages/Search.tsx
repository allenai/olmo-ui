import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Typography } from '@mui/material';

import { RemoteState } from '../contexts/util';
import { search } from '../api/dolma/search';
import { SearchForm } from '../components/dolma/SearchForm';
import { SearchResultList } from '../components/dolma/SearchResultList';
import { NoPaddingContainer, SearchWrapper } from '../components/dolma/shared';
import { AnalyticsClient } from '../api/AnalyticsClient';
import { useAppContext } from '../AppContext';

export const Search = () => {
    const loc = useLocation();
    const request = search.fromQueryString(loc.search);
    const analytics = new AnalyticsClient();

    const doSearch = useAppContext((state) => state.doSearch);
    const searchState = useAppContext((state) => state.searchState);
    const response = useAppContext((state) => state.searchResponse);
    const error = useAppContext((state) => state.searchError);

    useEffect(() => {
        doSearch(request).then((r) => {
            analytics.trackSearchQuery({ request, response: { meta: r.meta } });
        });
    }, [search.toQueryString(request)]);

    return (
        <>
            <SearchWrapper isLoading={searchState === RemoteState.Loading}>
                <SearchForm
                    defaultValue={request.query}
                    noCardOnDesktop={true}
                    disabled={searchState === RemoteState.Loading}
                />
                {searchState === RemoteState.Error && (
                    <SearchError message={error?.message ?? 'Unexpected Error'} />
                )}
                {searchState === RemoteState.Loaded && response && (
                    <SearchResultList response={response} />
                )}
            </SearchWrapper>
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
