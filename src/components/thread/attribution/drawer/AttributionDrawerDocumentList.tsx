import { Box, Card, CardContent, Typography } from '@mui/material';
import { useMemo } from 'react';

import { Document } from '@/api/AttributionClient';
import { useAppContext } from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import { hasSelectedSpansSelector } from '@/slices/attribution/attribution-selectors';

import {
    AttributionDocumentCard,
    AttributionDocumentCardSkeleton,
} from './AttributionDocumentCard';
import { messageAttributionDocumentsSelector } from './message-attribution-documents-selector';

interface DedupedDocument extends Document {
    duplicateDocumentIndexes: string[];
}
interface MatchingDocumentsTextProps {
    documentCount: number;
}
const MatchingDocumentsText = ({
    documentCount,
}: MatchingDocumentsTextProps): JSX.Element | null => {
    const hasSelectedSpan = useAppContext(hasSelectedSpansSelector);

    if (!hasSelectedSpan) {
        return null;
    }

    const documentsText = documentCount === 1 ? 'document' : 'documents';

    return (
        <Typography variant="body1">
            {documentCount} {documentsText} containing the selected span
        </Typography>
    );
};

const NoDocumentsCard = (): JSX.Element => {
    const isThereASelectedThread = useAppContext((state) => Boolean(state.selectedThreadRootId));

    const message = isThereASelectedThread ? (
        <>
            There are no documents from the training set that contain exact text matches to sections
            of the model response. This will often happen on short responses.
        </>
    ) : (
        <>Start a new thread or select an existing one to see response attributions.</>
    );

    return (
        <Card>
            <CardContent>{message}</CardContent>
        </Card>
    );
};

export const AttributionDrawerDocumentList = (): JSX.Element => {
    const attributionForMessage = useAppContext(messageAttributionDocumentsSelector);

    const { documents, loadingState } = attributionForMessage;

    const isPromptLoading = useAppContext(
        (state) => state.streamPromptState === RemoteState.Loading
    );

    const deduplicatedDocuments = useMemo(() => {
        // the key to this map is either the URL or the document index
        const documentsDedupedByUrl = new Map<string, DedupedDocument>();
        documents.forEach((currentDocument) => {
            if (currentDocument.url != null) {
                if (documentsDedupedByUrl.has(currentDocument.url)) {
                    documentsDedupedByUrl
                        .get(currentDocument.url)
                        ?.duplicateDocumentIndexes.push(currentDocument.index);
                } else {
                    documentsDedupedByUrl.set(currentDocument.url, {
                        ...currentDocument,
                        duplicateDocumentIndexes: [],
                    });
                }
            } else {
                if (documentsDedupedByUrl.has(currentDocument.index)) {
                    documentsDedupedByUrl
                        .get(currentDocument.index)
                        ?.duplicateDocumentIndexes.push(currentDocument.index);
                } else {
                    documentsDedupedByUrl.set(currentDocument.index, {
                        ...currentDocument,
                        duplicateDocumentIndexes: [],
                    });
                }
            }
        });

        return Array.from(documentsDedupedByUrl.values());
    }, [documents]);

    if (isPromptLoading) {
        return (
            <Card>
                <CardContent>
                    Once the response has been fully generated, documents from the training set that
                    contain exact text matches to sections of the model response will be displayed.
                </CardContent>
            </Card>
        );
    }

    if (loadingState === RemoteState.Loading) {
        return (
            <>
                <AttributionDocumentCardSkeleton />
                <AttributionDocumentCardSkeleton />
                <AttributionDocumentCardSkeleton />
                <AttributionDocumentCardSkeleton />
                <AttributionDocumentCardSkeleton />
            </>
        );
    }

    if (loadingState === RemoteState.Error) {
        return (
            <Card>
                <CardContent>
                    Something went wrong when getting documents that can be attributed to this
                    response. Please try another response.
                </CardContent>
            </Card>
        );
    }

    if (documents.length === 0) {
        return <NoDocumentsCard />;
    }

    return (
        <>
            {/*
                MatchingDocumentsText is in this component for now because I don't want to get into the memoizing selectors rabbit hole.
                When we do that we can move this up to the AttributionDrawer and have it get its own documentCount
            */}
            <MatchingDocumentsText documentCount={documents.length} />
            <Box p={0} m={0} component="ol" sx={{ display: 'contents', listStyleType: 'none' }}>
                {deduplicatedDocuments.map((document) => {
                    return (
                        <AttributionDocumentCard
                            key={document.index}
                            documentIndex={document.index}
                            text={document.text}
                            documentUrl={document.url}
                            source={document.source}
                            numRepetitions={document.duplicateDocumentIndexes.length + 1}
                        />
                    );
                })}
            </Box>
        </>
    );
};
