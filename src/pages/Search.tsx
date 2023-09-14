import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, TextField, Grid } from '@mui/material';

import { useAppContext } from '../AppContext';

interface SearchMeta {
    took_ms: number;
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

export function Search() {
    const loc = useLocation();

    const params = new URLSearchParams(loc.search);
    const query = params.get('query')?.trim() ?? '';
    const size = params.get('size')?.trim() ?? '10';
    const offset = params.get('offset')?.trim() ?? '0';

    const [form, setForm] = useState<{ query: string }>({ query });
    const [response, setResponse] = useState<SearchResults | undefined>();

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

    const nav = useNavigate();
    const submitSearch = (e: React.KeyboardEvent) => {
        if (e.key !== 'Enter') {
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
            <TextField
                value={form.query}
                fullWidth
                placeholder="Search pretraining data…"
                onChange={(e) => setForm({ ...form, query: e.currentTarget.value })}
                onKeyDown={(e) => submitSearch(e)}
            />
            {response ? (
                <Grid container direction="column" spacing={2} p={2}>
                    {response.results.map((r) => (
                        <Grid item key={r.id}>
                            <strong>ID: {r.id}</strong> | <small>{r.source}</small>
                            <p dangerouslySetInnerHTML={{ __html: r.highlights.text.join('…') }} />
                            {/* This can be large, and should probably be omitted. */}
                            <p>{r.text}</p>
                        </Grid>
                    ))}
                </Grid>
            ) : null}
        </Box>
    );
}
