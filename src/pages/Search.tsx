import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, TextField, Grid, Divider, Stack, Button, Pagination } from '@mui/material';

import styled from 'styled-components';

import { useAppContext } from '../AppContext';

interface SearchMeta {
    took_ms: number;
    total: number;
    overflow: boolean;
}

interface Highlights {
    text: string[];
}

interface Result {
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
    const [placeholder, setPlaceholder] = useState('Search pretraining documents…');

    const { userInfo } = useAppContext();
    useEffect(() => {
        if (!query) {
            return;
        }
        const url = `${process.env.LLMX_API_URL}/v3/data/search?${toQueryString(
            form.query,
            offset
        )}`;
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.data?.token}`,
        };
        fetch(url, { headers })
            .then((r) => r.json())
            .then((r) => setResponse(r));
    }, [userInfo.data?.token, query, size, offset]);

    useEffect(() => {
        const url = `${process.env.LLMX_API_URL}/v3/data/meta`;
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.data?.token}`,
        };
        fetch(url, { headers })
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

    return (
        <Box sx={{ background: 'white', borderRadius: 2, p: 2 }}>
            <Stack direction={'row'} spacing={3}>
                <PartialWidthTextField
                    value={form.query}
                    placeholder={placeholder}
                    onChange={(e) => setForm({ ...form, query: e.currentTarget.value })}
                    onKeyDown={(e) => submitSearch(e)}
                />
                <Button variant="contained" onClick={() => submitSearch()}>
                    Search
                </Button>
            </Stack>
            {response ? (
                <>
                    <Grid container direction="column" spacing={2} p={2}>
                        <Grid item>
                            <strong>
                                {response.meta.overflow ? 'More than ' : ''}
                                {Intl.NumberFormat().format(response.meta.total)} results (
                                {response.meta.took_ms}ms)
                            </strong>
                        </Grid>
                        {response.results.map((result) => (
                            <Grid item key={result.id}>
                                <strong>ID: {result.id}</strong> |{' '}
                                <small>Source: {result.source}</small>
                                <ResultsContainer>
                                    <p
                                        dangerouslySetInnerHTML={{
                                            __html: result.highlights.text.join('… '),
                                        }}
                                    />
                                </ResultsContainer>
                                <Divider />
                            </Grid>
                        ))}
                    </Grid>
                    <Stack alignItems="center">
                        <Pagination
                            boundaryCount={3}
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
        </Box>
    );
}

const PartialWidthTextField = styled(TextField)`
    width: 95%;
`;

const ResultsContainer = styled.p`
    &&& {
        em {
            font-style: normal;
            font-weight: bold;
        }
    }
`;
