import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, TextField, Grid, Stack, Button, Pagination, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import styled from 'styled-components';

import { CopyToClipboardButton } from '@allenai/varnish2/components';

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
                        <EqualPaddingGridItem item>
                            {response.meta.overflow ? 'More than ' : ''}
                            <strong>{Intl.NumberFormat().format(response.meta.total)}</strong>{' '}
                            results ({response.meta.took_ms}ms)
                        </EqualPaddingGridItem>
                        {response.results.map((result) => (
                            <NoPaddingGridItem item key={result.id}>
                                <ResultsContainer>
                                    <ResultMetadataContainer direction="row">
                                        <strong>Dolma ID:</strong>
                                        <CopyToClipboardButton
                                            buttonContent={<ContentCopyIcon fontSize="inherit" />}
                                            text={result.dolma_id}>
                                            <PaddedTypography noWrap>
                                                {result.dolma_id}
                                            </PaddedTypography>
                                        </CopyToClipboardButton>

                                        <span>
                                            <strong>Source: </strong> {result.source}
                                        </span>
                                    </ResultMetadataContainer>
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
                            </NoPaddingGridItem>
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

const EqualPaddingGridItem = styled(Grid)`
    padding-top: ${({ theme }) => theme.spacing(2)};
    padding-bottom: ${({ theme }) => theme.spacing(2)};
`;

const PartialWidthTextField = styled(TextField)`
    width: 95%;
`;

const ResultsContainer = styled.div`
    border-top: 1px solid ${({ theme }) => theme.color2.N2};
    padding-top: ${({ theme }) => theme.spacing(3.5)};
    padding-bottom: ${({ theme }) => theme.spacing(3.5)};
`;

const NoPaddingGridItem = styled(Grid)`
    &&& {
        padding-top: 0px;
    }
`;

const ResultsHighlights = styled.p`
    margin-top: 0px;
    margin-bottom: 0px;
    &&& {
        em {
            font-style: normal;
            font-weight: bold;
        }
    }
    font-size: ${({ theme }) => theme.typography.body1.fontSize};
    color: ${({ theme }) => theme.color2.N5};
`;

const PaddedTypography = styled(Typography)`
    padding-left: ${({ theme }) => theme.spacing(0.5)};
    width: 75px;
`;

const ResultMetadataContainer = styled(Stack)`
    font-size: ${({ theme }) => theme.typography.body1.fontSize};
    color: ${({ theme }) => theme.color2.N4};
    &&& svg {
        color: ${({ theme }) => theme.color2.N4};
    }
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
