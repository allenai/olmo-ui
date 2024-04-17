import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Box, Divider, IconButton, Pagination, Stack, Typography } from '@mui/material';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { search } from '../../api/dolma/search';
import { DocumentMeta } from './DocumentMeta';
import { Snippets } from './Snippets';
import { AnalyticsClient } from '../../api/AnalyticsClient';
import { MetaTags } from './MetaTags';

import { links } from '../../Links';

interface SearchResultListProps {
    response: search.Response;
}
export const SearchResultList = ({ response }: SearchResultListProps) => {
    const loc = useLocation();
    const nav = useNavigate();
    const analytics = new AnalyticsClient();
    const showPagination = response && Math.ceil(response.meta.total / response.request.size) > 1;

    return (
        <>
            <MetaTags title={`${response.request.query} - Dolma Search Results`} />
            <Stack direction="column" gap={1.5} pt={3.5}>
                {response.meta.total === 0 && <NoResults query={response.request.query} />}
                {response.results.map((result, idx) => (
                    <>
                        <Box key={result.id} pb={1}>
                            <DocumentMeta dolmaId={result.dolma_id} source={result.source} />
                            <Link
                                to={documentURL(result.id, response.request.query)}
                                onClick={() => {
                                    analytics.trackSearchResultClick({
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
                        {response.results.length - 1 !== idx && (
                            <Divider sx={{ borderColor: (theme) => theme.color.N4.hex }} />
                        )}
                    </>
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
                    ) : null}
                    <AboutTheseResults />
                </Stack>
            </Stack>
        </>
    );
};

const NoResults = ({ query }: { query: string }) => {
    return (
        <>
            <Typography component="h4" variant="h4" m={0}>
                No results for {query}.
            </Typography>
            <p>Your search did not match any documents.</p>
        </>
    );
};

const AboutTheseResults = () => (
    <IconButton
        aria-label="About These Results"
        size="small"
        href={links.faqs}
        sx={{
            color: (theme) => theme.palette.text.primary,
        }}>
        <InfoOutlinedIcon />
        <Typography fontWeight="bold" sx={{ textDecoration: 'underline' }}>
            &nbsp;<u>About These Results</u>
        </Typography>
    </IconButton>
);

export function documentURL(id: string, query?: string) {
    const qs = query ? `?${new URLSearchParams({ query })}` : '';
    return links.document(id) + qs;
}
