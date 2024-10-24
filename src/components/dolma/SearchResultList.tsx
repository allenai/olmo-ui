import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Divider, IconButton, Link, Pagination, Stack, Typography } from '@mui/material';
import { Fragment, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { analyticsClient } from '@/analytics/AnalyticsClient';

import { search } from '../../api/dolma/search';
import { links } from '../../Links';
import { NoResults } from '../NoResults';
import { DocumentMeta } from './DocumentMeta';
import { Snippets } from './Snippets';
import { ToxicContentWarning } from './ToxicContentWarning';

interface SearchResultListProps {
    response: search.Response;
}
export const SearchResultList = ({ response }: SearchResultListProps): JSX.Element => {
    const loc = useLocation();
    const nav = useNavigate();
    const showPagination = Math.ceil(response.meta.total / response.request.size) > 1;
    const [revealedDocuments, setRevealedDocuments] = useState<Record<string, boolean>>({});

    // Function to handle the reveal action
    const handleReveal = (id: string) => {
        setRevealedDocuments((prev) => ({
            ...prev,
            [id]: !prev[id], // Toggle between true and false
        }));
    };

    return (
        <>
            <Stack direction="column" gap={1.5} p={2}>
                {response.meta.total === 0 && <NoResults request={response.request.query} />}
                {response.results.map((result, idx) => (
                    <Fragment key={result.id}>
                        <SearchResult
                            result={result}
                            revealedDocuments={revealedDocuments}
                            response={response}
                            idx={idx}
                            handleReveal={handleReveal}
                        />
                        {response.results.length - 1 !== idx && (
                            <Divider sx={{ borderColor: (theme) => theme.color.N4.hex }} />
                        )}
                    </Fragment>
                ))}
                <Stack
                    justifyContent="space-between"
                    alignItems="flex-start"
                    direction={{ xs: 'column', sm: 'row' }}
                    gap={{ xs: 2, sm: 0 }}>
                    {showPagination ? (
                        <Pagination
                            boundaryCount={1}
                            count={Math.ceil(response.meta.total / response.request.size)}
                            page={Math.ceil(response.request.offset / response.request.size) + 1}
                            onChange={(_, page: number) => {
                                nav(
                                    `${loc.pathname}?${search.toQueryString({
                                        ...response.request,
                                        offset: (page - 1) * response.request.size,
                                    })}`
                                );
                            }}
                        />
                    ) : (
                        <Box></Box> // pagination placeholder so flexbox stays consistent
                    )}
                    <AboutTheseResults />
                </Stack>
            </Stack>
        </>
    );
};

const AboutTheseResults = () => (
    <IconButton
        aria-label="About These Results"
        size="small"
        href={links.faqs}
        sx={{
            '&:hover': { borderRadius: '12px' },
            color: (theme) => theme.palette.text.primary,
        }}>
        <InfoOutlinedIcon />
        <Typography fontWeight="bold" sx={{ textDecoration: 'underline' }}>
            &nbsp;<u>About These Results</u>
        </Typography>
    </IconButton>
);

const SearchResult = ({
    result,
    revealedDocuments,
    response,
    idx,
    handleReveal,
}: {
    result: search.Result;
    revealedDocuments: Record<string, boolean>;
    response: search.Response;
    idx: number;
    handleReveal: (id: string) => void;
}) => {
    return (
        <Box
            pb={1}
            sx={{
                position: 'relative',
            }}>
            <Box
                sx={{
                    filter:
                        result.isDocumentBad && !revealedDocuments[result.id]
                            ? 'blur(2.5px)'
                            : 'none', // Blur effect when caution is shown
                    transition: 'filter 0.3s ease',
                }}>
                <DocumentMeta source={result.source} />
                <Link
                    underline="hover"
                    href={documentURL(result.id)}
                    onClick={() => {
                        analyticsClient.trackSearchResultClick({
                            request: response.request,
                            id: result.id,
                            source: result.source,
                            index: response.request.offset + idx,
                        });
                    }}>
                    <Typography
                        component="h3"
                        variant="h4"
                        m={0}
                        mt={1}
                        fontWeight="bold"
                        textOverflow="ellipsis"
                        overflow="hidden"
                        color="text.primary">
                        {result.title}
                    </Typography>
                </Link>
                <Box
                    aria-hidden={
                        result.isDocumentBad && !revealedDocuments[result.id] ? 'true' : 'false'
                    }>
                    <Snippets document={result} lineLimit={4} />
                </Box>
            </Box>
            {result.isDocumentBad && (
                <ToxicContentWarning
                    isRevealed={revealedDocuments[result.id]}
                    onReveal={() => {
                        handleReveal(result.id);
                    }}
                />
            )}
        </Box>
    );
};

export function documentURL(id: string, query?: string) {
    const qs = query ? `?${new URLSearchParams({ query }).toString()}` : '';
    return links.document(id) + qs;
}
