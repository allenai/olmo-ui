import { Typography } from '@mui/material';
import { defer, LoaderFunction, useLocation } from 'react-router-dom';

import { PageContentWrapper } from '@/components/dolma/PageContentWrapper';

import { search } from '../api/dolma/search';
import { appContext, useAppContext } from '../AppContext';
import { SearchForm } from '../components/dolma/SearchForm';
import { SearchResultList } from '../components/dolma/SearchResultList';
import { NoPaddingContainer } from '../components/dolma/shared';
import { RemoteState } from '../contexts/util';

export const searchPageLoader: LoaderFunction = ({ request }) => {
    const query = new URL(request.url).searchParams.toString();
    const searchRequest = search.fromQueryString(query);

    if (searchRequest.query) {
        return defer({ searchResponse: appContext.getState().doSearch(searchRequest) });
    }

    return null;
};

export const Search = () => {
    const loc = useLocation();
    const request = search.fromQueryString(loc.search);

    const searchState = useAppContext((state) => state.searchState);
    const response = useAppContext((state) => state.searchResponse);
    const error = useAppContext((state) => state.searchError);

    return (
        <>
            <PageContentWrapper isLoading={searchState === RemoteState.Loading}>
                <SearchForm
                    showTooltip={false}
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
            </PageContentWrapper>
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
