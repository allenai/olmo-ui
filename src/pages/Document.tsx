import React, { useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { LinearProgress, Button, Typography, DialogTitle, Dialog, Stack } from '@mui/material';
import styled from 'styled-components';

import { SearchContainer, NoPaddingContainer } from '../components/dolma/shared';
import { useDocumentStore, DocumentStore } from '../store/DocumentStore';
import { RemoteState } from '../contexts/util';
import { DocumentMeta } from '../components/dolma/DocumentMeta';
import { Snippets } from '../components/dolma/Snippets';
import { search } from '../api/dolma/search';
import { AnalyticsClient } from '../api/dolma/AnalyticsClient';
import { MetaTags } from '../components/dolma/MetaTags';

const DocumentDetails = () => {
    const [metadataModalOpen, setMetadataModalOpen] = React.useState(false);
    const handleModalOpen = () => setMetadataModalOpen(true);
    const handleModalClose = () => setMetadataModalOpen(false);

    const store = useDocumentStore();
    const params = useParams<{ id: string; query?: string }>();
    if (!params.id) {
        throw new Error('No document ID');
    }
    const id = params.id;

    const loc = useLocation();
    const { query } = search.fromQueryString(loc.search);
    useEffect(() => {
        store
            .getDocument({ id, query: query.trim() !== '' ? query.trim() : undefined })
            .then((d) => {
                const analytics = new AnalyticsClient();
                analytics.trackDocumentView({ id, query, source: d.source });
            });
    }, [id]);

    const takeDownFormUrl = 'https://forms.gle/hGoEs8PJszcmxmh56';

    const handleShareClick = () => {
        navigator.clipboard.writeText(window.location.toString());
        const analytics = new AnalyticsClient();
        if (store.document) {
            analytics.trackDocumentShare({
                id: store.document.id,
                query,
                source: store.document.source,
            });
        }
    };

    return (
        <SearchContainer>
            <DocumentContainer sx={{ padding: 0 }}>
                {store.state === RemoteState.Loading ? <LinearProgress /> : null}
                {store.state === RemoteState.Error ? (
                    <div>
                        <h4>Something went wrong.</h4>
                        <p>{store.error?.message ?? 'Unexpected Error'}</p>
                    </div>
                ) : null}
                {store.state === RemoteState.Loaded && store.document ? (
                    <>
                        <MetaTags
                            title={
                                store.document?.title
                                    ? `Dolma Document - ${store.document?.title}`
                                    : undefined
                            }
                        />
                        <DocumentMeta doc={store.document} />
                        <Typography variant="h4" sx={{ mt: 1 }}>
                            {store.document.title}
                        </Typography>
                        <Snippets document={store.document} whiteSpace />
                        <ButtonsContainer direction="row" spacing={2} flexWrap="wrap">
                            <Button variant="outlined" onClick={handleShareClick}>
                                <Typography>Copy Link to Share</Typography>
                            </Button>
                            <Button
                                variant="outlined"
                                component={Link}
                                rel="noopener noreferrer"
                                target="_blank"
                                to={takeDownFormUrl}
                                href={takeDownFormUrl}>
                                <Typography>Request Removal</Typography>
                            </Button>
                            <Button variant="outlined" onClick={handleModalOpen}>
                                <Typography>View Metadata</Typography>
                                <Dialog
                                    fullWidth
                                    maxWidth="md"
                                    onClose={handleModalClose}
                                    open={metadataModalOpen}>
                                    <MetadataDetails>
                                        {JSON.stringify(store.document, null, 2)}
                                    </MetadataDetails>
                                </Dialog>
                            </Button>
                        </ButtonsContainer>
                    </>
                ) : null}
            </DocumentContainer>
        </SearchContainer>
    );
};

export const Document = () => (
    <DocumentStore>
        <DocumentDetails />
    </DocumentStore>
);

const DocumentContainer = styled(NoPaddingContainer)`
    word-break: break-word;
`;

const MetadataDetails = styled(DialogTitle)`
    white-space: pre-wrap;
`;

const ButtonsContainer = styled(Stack)`
    margin-top: ${({ theme }) => theme.spacing(2)};
`;
