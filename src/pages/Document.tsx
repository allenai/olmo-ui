import React, { useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { LinearProgress, Button, Typography, DialogTitle, Dialog, Stack } from '@mui/material';
import styled from 'styled-components';

import { NoPaddingContainer } from '../components/dolma/shared';
import { RemoteState } from '../contexts/util';
import { DocumentMeta } from '../components/dolma/DocumentMeta';
import { Snippets } from '../components/dolma/Snippets';
import { search } from '../api/dolma/search';
import { AnalyticsClient } from '../api/AnalyticsClient';
import { MetaTags } from '../components/dolma/MetaTags';
import { useAppContext } from '@/AppContext';

export const Document = () => {
    const getDocument = useAppContext((state) => state.getDocument);
    const documentDetails = useAppContext((state) => state.document);
    const documentState = useAppContext((state) => state.documentState);
    const documentError = useAppContext((state) => state.documentError);
    const [metadataModalOpen, setMetadataModalOpen] = React.useState(false);
    const handleModalOpen = () => setMetadataModalOpen(true);
    const handleModalClose = () => setMetadataModalOpen(false);
    const analytics = new AnalyticsClient();

    const params = useParams<{ id: string; query?: string }>();
    if (!params.id) {
        throw new Error('No document ID');
    }
    const id = params.id;

    const loc = useLocation();
    const { query } = search.fromQueryString(loc.search);
    useEffect(() => {
        getDocument({ id, query: query.trim() !== '' ? query.trim() : undefined }).then((d) => {
            analytics.trackDocumentView({ id, query, source: d.source });
        });
    }, [id]);

    const takeDownFormUrl = 'https://forms.gle/hGoEs8PJszcmxmh56';

    const handleShareClick = () => {
        navigator.clipboard.writeText(window.location.toString());
        if (documentDetails) {
            analytics.trackDocumentShare({
                id: documentDetails.id,
                query,
                source: documentDetails.source,
            });
        }
    };

    return (
        <DocumentContainer sx={{ padding: 0 }}>
            {documentState === RemoteState.Loading ? <LinearProgress /> : null}
            {documentState === RemoteState.Error ? (
                <div>
                    <h4>Something went wrong.</h4>
                    <p>{documentError?.message ?? 'Unexpected Error'}</p>
                </div>
            ) : null}
            {documentState === RemoteState.Loaded && documentDetails ? (
                <>
                    <MetaTags
                        title={
                            documentDetails.title
                                ? `Dolma Document - ${documentDetails.title}`
                                : undefined
                        }
                    />
                    <DocumentMeta doc={documentDetails} />
                    <Typography variant="h4" sx={{ mt: 1 }}>
                        {documentDetails.title}
                    </Typography>
                    <Snippets document={documentDetails} whiteSpace />
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
                                    {JSON.stringify(documentDetails, null, 2)}
                                </MetadataDetails>
                            </Dialog>
                        </Button>
                    </ButtonsContainer>
                </>
            ) : null}
        </DocumentContainer>
    );
};

const DocumentContainer = styled(NoPaddingContainer)`
    word-break: break-word;
`;

const MetadataDetails = styled(DialogTitle)`
    white-space: pre-wrap;
`;

const ButtonsContainer = styled(Stack)`
    margin-top: ${({ theme }) => theme.spacing(2)};
`;
