import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    TextField,
    Grid,
    Stack,
    Button,
    Pagination,
    useMediaQuery,
    useTheme,
    LinearProgress,
} from '@mui/material';
import styled from 'styled-components';

import { IdAndSourceComponent } from '../components/IdAndSourceComponent';
import { DolmaPanel } from '../components/DolmaPanel';
import { SearchResultsContainer } from '../components/shared';

interface SearchMeta {
    took_ms: number;
    total: number;
    overflow: boolean;
}

interface Highlights {
    text: string[];
}

interface Result {
    dolma_id: string;
    first_n: string;
    id: string;
    text: string;
    source: string;
    highlights: Highlights;
    score: number;
}

interface SearchResults {
    meta: SearchMeta;
    results: Result[];
}

interface SearchIndexMeta {
    count: number;
}

interface NoResultsProps {
    query: string;
}

enum QueryStringParam {
    Query = 'query',
    Offset = 'offset',
}

function toQueryString(query: string, offset: number): string {
    const qs = new URLSearchParams({
        [QueryStringParam.Query]: query,
        [QueryStringParam.Offset]: `${offset}`,
    });
    return `${qs}`;
}

const NoResultsGridItem = ({ query }: NoResultsProps) => {
    return (
        <NoPaddingGrid item>
            <h4>No results for {query}.</h4>
            <p>Your search did not match any documents.</p>
        </NoPaddingGrid>
    );
};

const NewSearchPlaceholder = () => {
    return (
        <NoPaddingGrid item>
            <h4>Finally, a pretraining dataset you can inspect for yourself.</h4>
            <p>Not sure what to search for? Try one of the following queries:</p>
            <Stack direction="row" spacing={1.5}>
                <a href='/search?query="Joe+Biden"'>"Joe Biden"</a>
                <span>&#183;</span>
                <a href="/search?query=Seattle">"Seattle"</a>
                <span>&#183;</span>
                <a href='/search?query="ham+sandwich"'>"ham sandwich"</a>
            </Stack>
        </NoPaddingGrid>
    );
};

export function Search() {
    const loc = useLocation();
    const size = 10; // size is fixed to 10, can modify in the future

    const params = new URLSearchParams(loc.search);
    const query = params.get(QueryStringParam.Query)?.trim() ?? '';
    const os = parseInt(params.get(QueryStringParam.Offset) ?? '');
    const offset = isNaN(os) ? 0 : os;
    const page = Math.ceil(offset / size) + 1;

    const [form, setForm] = useState<{ query: string }>({ query });
    const [response, setResponse] = useState<SearchResults | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    const [placeholder, setPlaceholder] = useState('Search pretraining documents…');

    useEffect(() => {
        if (!query) {
            return;
        }
        setLoading(true);
        const url = `${process.env.LLMX_API_URL}/v3/data/search?${toQueryString(
            form.query,
            offset
        )}`;
        fetch(url, { credentials: 'include' })
            .then((r) => r.json())
            .then((r) => setResponse(r))
            .finally(() => setLoading(false));
    }, [query, size, offset]);

    useEffect(() => {
        const url = `${process.env.LLMX_API_URL}/v3/data/meta`;
        fetch(url, { credentials: 'include' })
            .then((r) => r.json())
            .then(({ count }: SearchIndexMeta) => {
                setPlaceholder(
                    `Search ${Intl.NumberFormat().format(count)} pretraining documents…`
                );
            });
    }, []);

    const nav = useNavigate();
    const submitSearch = (e?: React.KeyboardEvent) => {
        if (e && e.key !== 'Enter') {
            return;
        }
        nav(`${loc.pathname}?${toQueryString(form.query, offset)}`);
    };
    const theme = useTheme();
    const greaterThanMd = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <SearchResultsContainer>
            <Stack direction={greaterThanMd ? 'row' : 'column'} spacing={6}>
                <DolmaPanel />
                <FullWidthContainer>
                    <Stack direction={'row'} spacing={2}>
                        <PartialWidthTextField
                            disabled={loading}
                            value={form.query}
                            placeholder={placeholder}
                            onChange={(e) => setForm({ ...form, query: e.currentTarget.value })}
                            onKeyDown={(e) => submitSearch(e)}
                        />
                        <Button
                            variant="contained"
                            disabled={loading}
                            onClick={() => submitSearch()}>
                            Search
                        </Button>
                    </Stack>
                    {loading ? <LinearProgress sx={{ mt: 3 }} /> : null}
                    {!loading && !response ? <NewSearchPlaceholder /> : null}
                    {!loading && response ? (
                        <>
                            <Grid container direction="column" spacing={2} p={2}>
                                <EqualPaddingGrid item>
                                    {response.meta.overflow ? 'More than ' : ''}
                                    <strong>
                                        {Intl.NumberFormat().format(response.meta.total)}
                                    </strong>{' '}
                                    results ({response.meta.took_ms}ms)
                                </EqualPaddingGrid>
                                {response.results.length === 0 && (
                                    <NoResultsGridItem query={form.query} />
                                )}
                                {response.results.map((result) => (
                                    <NoPaddingGrid item key={result.id}>
                                        <ResultsContainer>
                                            <IdAndSourceComponent
                                                idDescriptor="Dolma ID"
                                                id={result.dolma_id}
                                                source={result.source}
                                            />
                                            <SearchTitleContainer>
                                                <SearchTitle href={`/doc/${result.id}`}>
                                                    {result.first_n}
                                                </SearchTitle>
                                            </SearchTitleContainer>
                                            <ResultsHighlights
                                                dangerouslySetInnerHTML={{
                                                    __html: result.highlights.text.join('… '),
                                                }}
                                            />
                                        </ResultsContainer>
                                    </NoPaddingGrid>
                                ))}
                            </Grid>
                            <Stack alignItems="center">
                                <Pagination
                                    boundaryCount={1}
                                    count={Math.ceil(response.meta.total / size)}
                                    page={page}
                                    onChange={(_, page: number) => {
                                        nav(
                                            `${loc.pathname}?${toQueryString(
                                                form.query,
                                                (page - 1) * size
                                            )}`
                                        );
                                    }}
                                />
                            </Stack>
                        </>
                    ) : null}
                </FullWidthContainer>
            </Stack>
        </SearchResultsContainer>
    );
}

const EqualPaddingGrid = styled(Grid)`
    padding-top: ${({ theme }) => theme.spacing(2)};
    padding-bottom: ${({ theme }) => theme.spacing(2)};
    &&& {
        padding-left: 0;
    }
`;

const NoPaddingGrid = styled(Grid)`
    &&& {
        padding-top: 0;
        padding-left: 0;
    }
`;

const FullWidthContainer = styled.div`
    width: 100%;
`;

const PartialWidthTextField = styled(TextField)`
    width: 95%;
`;

const ResultsContainer = styled.div`
    border-top: 1px solid ${({ theme }) => theme.color2.N2};
    padding-top: ${({ theme }) => theme.spacing(3.5)};
    padding-bottom: ${({ theme }) => theme.spacing(3.5)};
`;

const ResultsHighlights = styled.p`
    margin-top: 0;
    margin-bottom: 0;
    &&& {
        em {
            font-style: normal;
            font-weight: bold;
        }
    }
    font-size: ${({ theme }) => theme.typography.body1.fontSize};
    color: ${({ theme }) => theme.color2.N5};
`;

const SearchTitleContainer = styled.div`
    padding-top: ${({ theme }) => theme.spacing(0.5)};
    padding-bottom: ${({ theme }) => theme.spacing(1)};
`;

const SearchTitle = styled.a`
    font-size: ${({ theme }) => theme.typography.h4.fontSize};
    font-weight: bold;
    color: ${({ theme }) => theme.color2.B3};
`;
