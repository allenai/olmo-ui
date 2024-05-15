import { Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { useAppContext } from '@/AppContext';
import { RequestRemovalButton, ShareButton } from '@/components/dolma/DocumentButtons';
import { PageContentWrapper } from '@/components/dolma/PageContentWrapper';
import { SearchForm } from '@/components/dolma/SearchForm';
import { NoPaddingContainer } from '@/components/dolma/shared';

import { search } from '../api/dolma/search';
import { DocumentMeta } from '../components/dolma/DocumentMeta';
import { Snippets } from '../components/dolma/Snippets';
import { RemoteState } from '../contexts/util';

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
            analyticsClient.trackDocumentView({ id, query, source: d.source });
        });
    }, [getDocument, id, query]);

    const handleShareClick = () => {
        if (documentDetails) {
            analyticsClient.trackDocumentShare({
                id: documentDetails.id,
                query,
                source: documentDetails.source,
            });
        }
    };

    return (
        <>
            <PageContentWrapper isLoading={documentState === RemoteState.Loading}>
                <SearchForm
                    defaultValue={query}
                    noCardOnDesktop={true}
                    disabled={documentState === RemoteState.Loading}
                />
            </PageContentWrapper>
            {documentState === RemoteState.Error && (
                <DocumentError message={documentError?.message ?? 'Unexpected Error'} />
            )}
            {documentState === RemoteState.Loaded && documentDetails && (
                <Stack pt={3.5}>
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
