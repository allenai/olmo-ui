import styled from 'styled-components';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Grid, Pagination } from '@mui/material';

import { search } from '../../api/dolma/search';
import { NoPaddingContainer, NoPaddingGrid } from './shared';
import { SearchForm } from './SearchForm';
import { DocumentMeta } from './DocumentMeta';
import { Snippets } from './Snippets';
import { AnalyticsClient } from '../../api/dolma/AnalyticsClient';
import { MetaTags } from './MetaTags';

export function documentURL(id: string, query?: string) {
    const qs = query ? `?${new URLSearchParams({ query })}` : '';
    return `/document/${id}${qs}`;
}

const NoResults = ({ query }: { query: string }) => {
    return (
        <NoPaddingGrid item>
            <h4>No results for {query}.</h4>
            <p>Your search did not match any documents.</p>
        </NoPaddingGrid>
    );
};

interface Props {
    response: search.Response;
}

export const SearchResultList = ({ response }: Props) => {
    const loc = useLocation();
    const nav = useNavigate();
    const showPagination = response && Math.ceil(response.meta.total / response.request.size) > 1;

    return (
        <NoPaddingContainer>
            <MetaTags title={`${response.request.query} - Dolma Search Results`} />
            <SearchForm defaultValue={response.request.query} />
            <Grid container direction="column" spacing={2} p={2}>
                <EqualPaddingGrid item>
                    {response.meta.overflow ? 'More than ' : ''}
                    <strong>{response.meta.total.toLocaleString()}</strong> results (
                    {response.meta.took_ms.toLocaleString()}ms)
                </EqualPaddingGrid>
                {response.meta.total === 0 && <NoResults query={response.request.query} />}
                {response.results.map((result, idx) => (
                    <NoPaddingGrid item key={result.id}>
                        <ResultsContainer>
                            <DocumentMeta doc={result} />
                            <SearchTitleContainer>
                                <SearchTitleLink
                                    to={documentURL(result.id, response.request.query)}
                                    onClick={() => {
                                        const analytics = new AnalyticsClient();
                                        analytics.trackSearchResultClick({
                                            request: response.request,
                                            id: result.id,
                                            source: result.source,
                                            index: response.request.offset + idx,
                                        });
                                    }}>
                                    {result.title}
                                </SearchTitleLink>
                            </SearchTitleContainer>
                            <Snippets document={result} />
                        </ResultsContainer>
                    </NoPaddingGrid>
                ))}
                {showPagination ? (
                    <NoPaddingGrid item>
                        <Pagination
                            boundaryCount={1}
                            count={Math.ceil(response.meta.total / response.request.size)}
                            page={Math.ceil(response.request.offset / response.request.size) + 1}
                            onChange={(_, page: number) => {
                                if (!response) {
                                    return;
                                }
                                nav(
                                    `${loc.pathname}?${search.toQueryString({
                                        ...response.request,
                                        offset: (page - 1) * response.request.size,
                                    })}`
                                );
                            }}
                        />
                    </NoPaddingGrid>
                ) : null}
            </Grid>
        </NoPaddingContainer>
    );
};

const EqualPaddingGrid = styled(Grid)`
    &&& {
        padding-top: ${({ theme }) => theme.spacing(2)};
        padding-bottom: ${({ theme }) => theme.spacing(2)};
        padding-left: 0;
        color: ${({ theme }) => theme.color2.N1.hex};
    }
`;

const ResultsContainer = styled.div`
    border-top: 1px solid ${({ theme }) => theme.color2.N1.hex};
    padding-top: ${({ theme }) => theme.spacing(3.5)};
    padding-bottom: ${({ theme }) => theme.spacing(3.5)};
    word-break: break-word;
`;

const SearchTitleContainer = styled.div`
    padding-top: ${({ theme }) => theme.spacing(0.5)};
    padding-bottom: ${({ theme }) => theme.spacing(1)};
`;

const SearchTitleLink = styled(Link)`
    font-size: ${({ theme }) => theme.typography.h4.fontSize};
    font-weight: bold;
    color: ${({ theme }) => theme.color2.B3.hex};
`;
