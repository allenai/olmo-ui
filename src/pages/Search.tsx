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

export function Search() {
    const loc = useLocation();
    const shiftSizeForPagination = 10;

    const params = new URLSearchParams(loc.search);
    const query = params.get('query')?.trim() ?? '';
    const size = shiftSizeForPagination.toString(); // currently fixing size at 10, can modify this in the future
    const offset = params.get('offset')?.trim() ?? '0';

    const [currentOffset, setCurrentOffset] = useState<number>(parseInt(offset, 10));

    const [form, setForm] = useState<{ query: string }>({ query });
    const [response, setResponse] = useState<SearchResults | undefined>();
    const [placeholder, setPlaceholder] = useState('Search pretraining documents…');

    const { userInfo } = useAppContext();
    useEffect(() => {
        if (!query) {
            return;
        }
        const currentOffsetString = currentOffset.toString();
        const qs = new URLSearchParams({ query, size, offset: currentOffsetString });
        const url = `${process.env.LLMX_API_URL}/v2/data/search?${qs}`;
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.data?.token}`,
        };
        fetch(url, { headers })
            .then((r) => r.json())
            .then((r) => setResponse(r));
    }, [userInfo.data?.token, query, size, currentOffset]);

    useEffect(() => {
        const url = `${process.env.LLMX_API_URL}/v2/data/meta`;
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
        const qs = new URLSearchParams({
            query: form.query,
            size: size.toString(),
            offset: currentOffset.toString(),
        });
        nav(`${loc.pathname}?${qs.toString()}`);
    };

    const [page, setPage] = React.useState(Math.floor(currentOffset / 10) + 1);
    const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        const newOffset = value * shiftSizeForPagination - shiftSizeForPagination;
        setCurrentOffset(newOffset);
        const qs = new URLSearchParams({
            query: form.query,
            size: size.toString(),
            offset: newOffset.toString(),
        });
        window.history.replaceState(null, '', `${loc.pathname}?${qs.toString()}`);
        setPage(value);
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
                            count={Math.round(response.meta.total / shiftSizeForPagination)}
                            page={page}
                            onChange={handleChange}
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
