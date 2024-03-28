import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LinearProgress } from '@mui/material';

import { SearchStore, useSearchStore } from '../store/SearchStore';
import { MetaStore } from '../store/MetaStore';
import { RemoteState } from '../api/dolma/RemoteState';
import { search } from '../api/dolma/search';
import { SearchForm } from '../components/dolma/SearchForm';
import { SearchResultList } from '../components/dolma/SearchResultList';
import { NoPaddingContainer, NoPaddingGrid, SearchContainer } from '../components/dolma/shared';
import { AnalyticsClient } from '../api/dolma/AnalyticsClient';

const SearchError = ({ message }: { message: string }) => {
    return (
        <NoPaddingGrid>
            <h4>Something went wrong</h4>
            <p>{message}</p>
        </NoPaddingGrid>
    );
};

const SearchResults = () => {
    const loc = useLocation();
    const request = search.fromQueryString(loc.search);
    const store = useSearchStore();
    useEffect(() => {
        store.search(request).then((r) => {
            const analytics = new AnalyticsClient();
            analytics.trackSearchQuery({ request, response: { meta: r.meta } });
        });
    }, [search.toQueryString(request)]);

    switch (store.state) {
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
                    <SearchForm defaultValue={store.request.query} />
                    <SearchError message={store.error?.message ?? 'Unexpected Error'} />
                </NoPaddingContainer>
            );
        }
        case RemoteState.Ok: {
            if (!store.response) {
                throw new Error('No response');
            }
            return <SearchResultList response={store.response} />;
        }
    }
};

export const Search = () => {
    return (
        <MetaStore>
            <SearchStore>
                <SearchContainer>
                    <SearchResults />
                </SearchContainer>
            </SearchStore>
        </MetaStore>
    );
};
