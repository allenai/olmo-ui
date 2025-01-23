import { Box, Card, CardContent, Stack, styled, Typography } from '@mui/material';
import { Fragment, useMemo } from 'react';

import { Document } from '@/api/AttributionClient';
import { useAppContext } from '@/AppContext';
import { ImageSpinner } from '@/components/ImageSpinner';
import { RemoteState } from '@/contexts/util';
import {
    hasSelectedSpansSelector,
    messageAttributionsSelector,
    messageLengthSelector,
} from '@/slices/attribution/attribution-selectors';

import {
    type AttributionBucket,
    calculateRelevanceScore,
    getBucketForScorePercentile,
} from '../calculate-relevance-score';
import { AttributionDocumentCard } from './AttributionDocumentCard/AttributionDocumentCard';
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

const AttributionDocumentGroupTitle = styled(Typography)(({ theme }) => ({
    fontWeight: theme.font.weight.semiBold,
    color:
        theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.text.primary,
    opacity: theme.palette.mode === 'light' ? 0.5 : undefined,
    paddingInline: theme.spacing(3),
    paddingBlockStart: theme.spacing(2.5),
    textTransform: 'uppercase',
}));

interface RelevanceGroup {
    title: string;
    collections: DedupedDocument[];
}

export const AttributionDrawerDocumentList = (): JSX.Element => {
    const isThereASelectedMessage = useAppContext((state) =>
        Boolean(state.attribution.selectedMessageId)
    );
    const attributionForMessage = useAttributionDocumentsForMessage();
    const attributionIndex = useAppContext((state) => messageAttributionsSelector(state)?.index);
    const messageLength = useAppContext((state) => messageLengthSelector(state));
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

    const relevance = deduplicatedDocuments.reduce<Record<AttributionBucket, RelevanceGroup>>(
        (acc, doc) => {
            const score = calculateRelevanceScore(doc.relevance_score, messageLength);
            const bucket = getBucketForScorePercentile(score);
            acc[bucket].collections.push(doc);

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

    if (!isThereASelectedMessage) {
        return (
            <Card>
                <CardContent>
                    To see training text matches for a model response, click the &ldquo;Match
                    training text&rdquo; button below it.
                </CardContent>
            </Card>
        );
    }

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
            <Stack
                flexGrow={1}
                justifyContent="center"
                alignItems="center"
                gap={3.5}
                sx={(theme) => ({
                    color: theme.palette.primary.main,
                })}>
                <ImageSpinner
                    src="/arrow-spin.svg"
                    alt=""
                    width={49}
                    height={49}
                    justifySelf="center"
                />
                <p>Searching 3.2B documents...</p>
            </Stack>
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
        return (
            <Card>
                <CardContent>
                    There are no documents from the training set that contain exact text matches to
                    sections of the model response. This will often happen on short responses.
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            {/*
                MatchingDocumentsText is in this component for now because I don't want to get into the memoizing selectors rabbit hole.
                When we do that we can move this up to the AttributionDrawer and have it get its own documentCount
            */}
            <MatchingDocumentsText documentCount={documents.length} />
            <Box
                component="ol"
                sx={{
                    display: 'contents',
                    listStyle: 'none',
                }}>
                {/* Object keys gives us string[] regardless of Record<Key,> */}
                {(Object.keys(relevance) as AttributionBucket[]).map((key) => {
                    const group = relevance[key];

                    if (group.collections.length === 0) {
                        return null;
                    }

                    return (
                        <Fragment key={key}>
                            <AttributionDocumentGroupTitle variant="subtitle2">
                                {group.title}
                            </AttributionDocumentGroupTitle>
                            {group.collections.map((doc) => (
                                <AttributionDocumentCard
                                    key={doc.index}
                                    documentId={doc.index}
                                    source={doc.source}
                                    // This has a +1 because the repeated document count should include this document we're showing here
                                    // the duplicateDocumentIndexes array doesn't include this document, just the others that are repeated
                                    repeatedDocumentCount={doc.duplicateDocumentIndexes.length + 1}
                                    index={attributionIndex}
                                    releavanceBucket={key}
                                />
                            ))}
                        </Fragment>
                    );
                })}
            </Box>
        </>
    );
};
