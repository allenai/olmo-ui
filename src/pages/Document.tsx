import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { LinearProgress, Typography, Stack, useMediaQuery, useTheme } from '@mui/material';

import { DocumentMeta } from '../components/dolma/DocumentMeta';
import { Snippets } from '../components/dolma/Snippets';
import { search } from '../api/dolma/search';
import { AnalyticsClient } from '../api/dolma/AnalyticsClient';
import { MetaTags } from '../components/dolma/MetaTags';
import { useAppContext } from '@/AppContext';

import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';
import { ElevatedPaper, NoPaddingContainer } from '@/components/dolma/shared';
import { RemoteState } from '../contexts/util';
import { RequestRemovalButton, ShareButton } from '@/components/dolma/DocumentButtons';
import { SearchForm } from '@/components/dolma/SearchForm';

export const Document = () => {
    const getDocument = useAppContext((state) => state.getDocument);
    const documentDetails = useAppContext((state) => state.document);
    const documentState = useAppContext((state) => state.documentState);
    const documentError = useAppContext((state) => state.documentError);

    const params = useParams<{ id: string; query?: string }>();
    if (!params.id) {
        throw new Error('No document ID');
    }
    const id = params.id;

    const loc = useLocation();
    const { query } = search.fromQueryString(loc.search);
    useEffect(() => {
        getDocument({ id, query: query.trim() !== '' ? query.trim() : undefined }).then((d) => {
            const analytics = new AnalyticsClient();
            analytics.trackDocumentView({ id, query, source: d.source });
        });
    }, [id]);

    const handleShareClick = () => {
        const analytics = new AnalyticsClient();
        if (documentDetails) {
            analytics.trackDocumentShare({
                id: documentDetails.id,
                query,
                source: documentDetails.source,
            });
        }
    };

    const theme = useTheme();
    const isDesktopOrUp = useMediaQuery(theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT));
    const SearchWrapper = isDesktopOrUp ? ElevatedPaper : NoPaddingContainer;

    return (
        <>
            <SearchWrapper>
                <SearchForm
                    defaultValue={query}
                    noCard={isDesktopOrUp}
                    disabled={documentState === RemoteState.Loading}
                />
            </SearchWrapper>
            {documentState === RemoteState.Error && (
                <DocumentError message={documentError?.message ?? 'Unexpected Error'} />
            )}
            {documentState === RemoteState.Loaded && documentDetails && (
                <Stack pt={3.5}>
                    <MetaTags
                        title={
                            documentDetails.title
                                ? `Dolma Document - ${documentDetails.title}`
                                : undefined
                        }
                    />
                    <DocumentMeta
                        dolmaId={documentDetails.dolma_id}
                        source={documentDetails.source}
                        url={documentDetails.url}
                    />
                    <Typography variant="h4" m={0} mt={1} textOverflow="ellipsis" overflow="hidden">
                        {documentDetails.title}
                    </Typography>
                    <Snippets document={documentDetails} whiteSpace />
                    <Stack direction="row" mt={1} spacing={2} flexWrap="wrap">
                        <ShareButton url={window.location.toString()} onClick={handleShareClick} />
                        <RequestRemovalButton />
                    </Stack>
                </Stack>
            )}
            {documentState === RemoteState.Loading && <LinearProgress sx={{ mt: 3 }} />}
        </>
    );
};

const DocumentError = ({ message }: { message: string }) => (
    <NoPaddingContainer>
        <h4>Something went wrong</h4>
        <Typography component="h4">Something went wrong</Typography>
        <Typography component="body">{message}</Typography>
    </NoPaddingContainer>
);
