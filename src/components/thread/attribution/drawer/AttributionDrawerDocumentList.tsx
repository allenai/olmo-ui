import { Box, Card, CardContent, Typography } from '@mui/material';
import { useMemo } from 'react';

import { Document } from '@/api/AttributionClient';
import { useAppContext } from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import {
    hasSelectedSpansSelector,
    messageAttributionsSelector,
} from '@/slices/attribution/attribution-selectors';

import { calculateRelevanceScore } from '../calculate-relevance-score';
import {
    AttributionDocumentCard,
    AttributionDocumentCardSkeleton,
} from './AttributionDocumentCard/AttributionDocumentCard';
import { useAttributionDocumentsForMessage } from './message-attribution-documents-selector';

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

interface RelevanceGroup {
    title: string;
    collections: DedupedDocument[];
}

export const AttributionDrawerDocumentList = (): JSX.Element => {
    const attributionForMessage = useAttributionDocumentsForMessage();
    const attributionIndex = useAppContext((state) => messageAttributionsSelector(state)?.index);
    const messageLength = useAppContext((state) => {
        if (state.attribution.selectedMessageId != null) {
            return (
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                state.selectedThreadMessagesById[state.attribution.selectedMessageId]?.content
                    .length || 0
            );
        }
        return 0;
    });
    const { documents, loadingState } = attributionForMessage;

    const isSelectedMessageLoading = useAppContext(
        (state) =>
            state.streamPromptState === RemoteState.Loading &&
            state.streamingMessageId === state.attribution.selectedMessageId
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

    const relevance = deduplicatedDocuments.reduce<Record<string, RelevanceGroup>>(
        (acc, doc) => {
            const score = calculateRelevanceScore(doc.relevance_score, messageLength);
            if (score >= 0.7) {
                acc.high.collections.push(doc);
            } else if (score >= 0.5) {
                acc.medium.collections.push(doc);
            } else {
                acc.low.collections.push(doc);
            }

            return acc;
        },
        {
            high: {
                title: 'High Relevance',
                collections: [],
            },
            medium: {
                title: 'Medium Relevance',
                collections: [],
            },
            low: {
                title: 'Low Relevance',
                collections: [],
            },
        }
    );

    if (isSelectedMessageLoading) {
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
                {Object.keys(relevance).map((key) => {
                    const group = relevance[key];

                    if (group.collections.length === 0) {
                        return null;
                    }

                    return (
                        <>
                            <Typography>{group.title}</Typography>
                            {group.collections.map((doc) => (
                                <AttributionDocumentCard
                                    key={doc.index}
                                    documentId={doc.index}
                                    documentUrl={doc.url}
                                    source={doc.source}
                                    // This has a +1 because the repeated document count should include this document we're showing here
                                    // the duplicateDocumentIndexes array doesn't include this document, just the others that are repeated
                                    repeatedDocumentCount={doc.duplicateDocumentIndexes.length + 1}
                                    index={attributionIndex}
                                />
                            ))}
                        </>
                    );
                })}
            </Box>
        </>
    );
};
