import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
    Box,
    Button,
    Divider,
    IconButton,
    Pagination,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { Fragment, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { analyticsClient } from '@/analytics/AnalyticsClient';

import { search } from '../../api/dolma/search';
import { links } from '../../Links';
import { NoResults } from '../NoResults';
import { DocumentMeta } from './DocumentMeta';
import { Snippets } from './Snippets';

interface SearchResultListProps {
    response: search.Response;
}
export const SearchResultList = ({ response }: SearchResultListProps): JSX.Element => {
    const loc = useLocation();
    const nav = useNavigate();
    const showPagination = Math.ceil(response.meta.total / response.request.size) > 1;
    const [revealedDocuments, setRevealedDocuments] = useState<Record<string, boolean>>({});

    const handleReveal = (id: string) => {
        setRevealedDocuments((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <>
            <Stack direction="column" gap={1.5} pt={2}>
                {response.meta.total === 0 && <NoResults request={response.request.query} />}
                {response.results.map((result, idx) => (
                    <Fragment key={result.id}>
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
                                <DocumentMeta dolmaId={result.dolma_id} source={result.source} />
                                <Link
                                    to={documentURL(result.id, response.request.query)}
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
                                        variant="h6"
                                        m={0}
                                        mt={1}
                                        textOverflow="ellipsis"
                                        overflow="hidden"
                                        color={(theme) => theme.color.B6.hex}>
                                        {result.title}
                                    </Typography>
                                </Link>
                                <Snippets document={result} lineLimit={4} />
                            </Box>
                            {result.isDocumentBad && (
                                <Paper
                                    elevation={revealedDocuments[result.id] ? 0 : 3}
                                    sx={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: revealedDocuments[result.id]
                                            ? 'flex-start'
                                            : 'space-between',
                                        p: 2,
                                        bgcolor: 'white',
                                        border: revealedDocuments[result.id]
                                            ? 'none'
                                            : '1px solid white',
                                        borderRadius: '8px',
                                        zIndex: revealedDocuments[result.id] ? 0 : 10,
                                        position: revealedDocuments[result.id]
                                            ? 'static'
                                            : 'absolute',
                                        top: revealedDocuments[result.id] ? 'auto' : '50%',
                                        left: revealedDocuments[result.id] ? 'auto' : '50%',
                                        transform: revealedDocuments[result.id]
                                            ? 'none'
                                            : 'translate(-50%, -50%)',
                                        marginLeft: revealedDocuments[result.id] ? '-17px' : '0px',
                                    }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            flexWrap: 'wrap',
                                        }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                            }}>
                                            <WarningAmberIcon
                                                sx={(theme) => ({
                                                    mr: 1,
                                                    color: theme.palette.error.dark,
                                                })}
                                            />
                                            <Typography
                                                sx={(theme) => ({
                                                    color: theme.palette.error.dark,
                                                })}>
                                                Caution
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                            }}>
                                            <Typography>
                                                May contain inappropriate language
                                            </Typography>
                                            <InfoOutlinedIcon />
                                        </Box>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            ml: 'auto',
                                            mr: revealedDocuments[result.id] ? '-22px' : '0px',
                                        }}>
                                        <Button
                                            variant="contained"
                                            sx={(theme) => ({
                                                bgcolor: theme.palette.error.dark,
                                                '&:hover': {
                                                    bgcolor: theme.palette.error.dark,
                                                },
                                            })}
                                            onClick={() => {
                                                handleReveal(result.id);
                                            }}>
                                            {revealedDocuments[result.id] ? 'Conceal' : 'Reveal'}
                                        </Button>
                                    </Box>
                                </Paper>
                            )}
                        </Box>
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

export function documentURL(id: string, query?: string) {
    const qs = query ? `?${new URLSearchParams({ query }).toString()}` : '';
    return links.document(id) + qs;
}
