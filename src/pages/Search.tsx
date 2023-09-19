import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, TextField, Grid, Divider, Stack, Button } from '@mui/material';

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

    const params = new URLSearchParams(loc.search);
    const query = params.get('query')?.trim() ?? '';
    const size = params.get('size')?.trim() ?? '10';
    const offset = params.get('offset')?.trim() ?? '0';

    const [form, setForm] = useState<{ query: string }>({ query });
    const [response, setResponse] = useState<SearchResults | undefined>();
    const [placeholder, setPlaceholder] = useState('Search pretraining documents…');

    const { userInfo } = useAppContext();
    useEffect(() => {
        if (!query) {
            return;
        }
        const qs = new URLSearchParams({ query, size, offset });
        const url = `${process.env.LLMX_API_URL}/v2/data/search?${qs}`;
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.data?.token}`,
        };
        fetch(url, { headers })
            .then((r) => r.json())
            .then((r) => setResponse(r));
    }, [userInfo.data?.token, query, size, offset]);

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
            offset: offset.toString(),
        });
        nav(`${loc.pathname}?${qs.toString()}`);
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
                            <p
                                dangerouslySetInnerHTML={{
                                    __html: result.highlights.text.join('…'),
                                }}
                            />
                            <p>{result.text}</p>
                            <Divider />
                        </Grid>
                    ))}
                </Grid>
            ) : null}
        </Box>
    );
}

const PartialWidthTextField = styled(TextField)`
    width: 95%;
`;
