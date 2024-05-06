import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Divider, IconButton, Pagination, Stack, Typography } from '@mui/material';
import { Fragment } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { analyticsClient } from '@/analytics/AnalyticsClient';

import { search } from '../../api/dolma/search';
<<<<<<< HEAD
import { DocumentMeta } from './DocumentMeta';
import { Snippets } from './Snippets';
import { analyticsClient } from '@/analytics/AnalyticsClient';

=======
>>>>>>> main
import { links } from '../../Links';
import { DocumentMeta } from './DocumentMeta';
import { MetaTags } from './MetaTags';
import { Snippets } from './Snippets';

interface SearchResultListProps {
    response: search.Response;
}
export const SearchResultList = ({ response }: SearchResultListProps): JSX.Element => {
    const loc = useLocation();
    const nav = useNavigate();
    const showPagination = Math.ceil(response.meta.total / response.request.size) > 1;

    return (
        <>
            <Stack direction="column" gap={1.5} pt={2}>
                {response.meta.total === 0 && <NoResults request={response.request.query} />}
                {response.results.map((result, idx) => (
                    <Fragment key={result.id}>
                        <Box pb={1}>
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

const NoResults = ({ request }: { request: string }) => (
    <Box sx={{ p: 4, borderRadius: '12px', backgroundColor: (theme) => theme.color.N2.hex }}>
        <Typography
            variant="h6"
            sx={{ mt: 0, mb: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Your Search - &quot;{request}&quot; - did not match any results.
        </Typography>
        <Typography variant="body1">Suggestions</Typography>
        <Typography component="ul" variant="body1">
            <Typography component="li" variant="body1">
                Check spelling of keywords.
            </Typography>
            <Typography component="li" variant="body1">
                Try different keywords.
            </Typography>
            <Typography component="li" variant="body1">
                Try more general keywords.
            </Typography>
        </Typography>
    </Box>
);
