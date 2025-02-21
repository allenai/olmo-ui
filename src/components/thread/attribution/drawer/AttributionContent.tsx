import { ArrowBack } from '@mui/icons-material';
import { Box, Button, DialogContent, Link, Stack, styled, Typography } from '@mui/material';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useAppContext } from '@/AppContext';
import { useDesktopOrUp } from '@/components/dolma/shared';
import { getFAQIdByShortId } from '@/components/faq/faq-utils';
import {
    StandardDialogCloseButton,
    StandardDialogTitle,
    StandardModal,
} from '@/components/StandardModal';
import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';
import { useFeatureToggles } from '@/FeatureToggleContext';
import { links } from '@/Links';
import { messageLengthSelector } from '@/slices/attribution/attribution-selectors';

import { calculateRelevanceScore, getBucketForScorePercentile } from '../calculate-relevance-score';
import { AttributionDocumentCard } from './AttributionDocumentCard/AttributionDocumentCard';
import { AttributionDrawerDocumentList } from './AttributionDrawerDocumentList';
import { ClearSelectedSpanButton } from './ClearSelectedSpanButton';
import { useAttributionDocumentsForMessage } from './message-attribution-documents-selector';

const AttributionContentStack = styled(Stack)(({ theme }) => ({
    paddingBlockStart: theme.spacing(2),
    [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
        paddingBlockStart: theme.spacing(5),
    },
    paddingBlockEnd: theme.spacing(2),
    minHeight: '100%',
}));

interface AttributesModalProps {
    open: boolean;
    closeModal: () => void;
}

const AboutAttributionModal = ({ open, closeModal: handleClose }: AttributesModalProps) => {
    return (
        <StandardModal open={open} onClose={handleClose} data-testid="about-attribution-modal">
            <StandardDialogTitle variant="h4">
                Training Text Matches
                <StandardDialogCloseButton onClick={handleClose} />
            </StandardDialogTitle>
            <DialogContent sx={{ padding: 0 }}>
                <Typography paddingBlockEnd={1}>
                    This feature shows documents from the training data that have exact text matches
                    with the model response. Select a highlighted span to view its documents.
                </Typography>
                <Typography paddingBlockEnd={1}>
                    Some retrieved documents may be used to fact check parts of the model&apos;s
                    response, if the response contains simple facts. However, creative generations
                    (e.g. writing a poem) or novel generations (e.g. writing code) likely cannot be
                    fact checked by looking at these retrieved documents.
                </Typography>
                <Typography paddingBlockEnd={1}>
                    The model did not have direct access to these documents when generating the
                    response. Documents are retrieved after the response generation.
                </Typography>
                <Typography paddingBlockEnd={1}>
                    Training Text Matches uses{' '}
                    <Link
                        href="https://infini-gram.io"
                        target="_blank"
                        underline="always"
                        fontWeight={600}>
                        infini-gram
                    </Link>{' '}
                    to efficiently find text matches in the massive training dataset.
                </Typography>
                <Typography paddingBlockEnd={1}>
                    <Link
                        href={links.faqs + getFAQIdByShortId('corpuslink-intro')}
                        underline="always">
                        Learn more
                    </Link>
                </Typography>
            </DialogContent>
        </StandardModal>
    );
};

export const AttributionContent = () => {
    const [open, setOpen] = useState<boolean>(false);
    const { isDatasetExplorerEnabled } = useFeatureToggles();
    const closeModal = () => {
        setOpen(false);
    };
    const isDesktop = useDesktopOrUp();

    return (
        <AttributionContentStack
            direction="column"
            gap={2}
            data-testid="corpuslink-drawer"
            height="100%">
            <Stack direction="column" gap={2} paddingInline={3}>
                {isDesktop && (
                    <Typography variant="h5" sx={{ marginBlockStart: 0 }}>
                        Training Text Matches
                    </Typography>
                )}
                <Typography variant="body2">
                    Documents from the training data that have exact text matches with the model
                    response. Powered by{' '}
                    <Link
                        href="https://infini-gram.io"
                        target="_blank"
                        underline="always"
                        fontWeight={600}>
                        infini-gram
                    </Link>
                    <br />
                    <Button
                        onClick={() => {
                            setOpen(true);
                        }}
                        sx={{
                            padding: 0,
                        }}>
                        More about how matching works
                    </Button>
                </Typography>
                {isDatasetExplorerEnabled ? (
                    <Button
                        variant="contained"
                        href={links.datasetExplorer}
                        color="secondary"
                        disableRipple={true}
                        sx={{
                            marginTop: 1,
                        }}>
                        <Typography fontWeight={500}>Explore the full training dataset</Typography>
                    </Button>
                ) : null}
                <ClearSelectedSpanButton />
            </Stack>
            <AttributionDrawerDocumentList />
            <AboutAttributionModal open={open} closeModal={closeModal} />
        </AttributionContentStack>
    );
};

export const RepeatedAttributionDocumentsContent = () => {
    const attributionDocuments = useAttributionDocumentsForMessage();

    const repeatedDocumentsByUrl = useAppContext(
        useShallow((state) => {
            const selectedRepeatedDocumentIndex = state.attribution.selectedRepeatedDocumentIndex;

            const selectedDocument = attributionDocuments.documents.find(
                (document) => document.index === selectedRepeatedDocumentIndex
            );

            const documentsWithTheSameUrl = attributionDocuments.documents.filter(
                (document) => document.url === selectedDocument?.url
            );

            return documentsWithTheSameUrl;
        })
    );

    const resetSelectedRepeatedDocument = useAppContext(
        (state) => state.resetSelectedRepeatedDocument
    );

    const messageLength = useAppContext((state) => messageLengthSelector(state));

    const handleBackToCorpusLinkDocumentsClick = () => {
        resetSelectedRepeatedDocument();
    };

    return (
        <AttributionContentStack direction="column" gap={2} data-testid="repeated-documents-drawer">
            <Button
                onClick={handleBackToCorpusLinkDocumentsClick}
                variant="text"
                color="inherit"
                sx={{
                    justifyContent: 'start',
                    paddingInlineStart: 0,
                }}>
                <ArrowBack />
                &nbsp;Back to all documents
            </Button>

            <Typography variant="h4" component="p">
                Viewing {repeatedDocumentsByUrl.length} repeated documents
            </Typography>
            <Box
                component="ol"
                sx={{
                    display: 'contents',
                    listStyle: 'none',
                }}>
                {repeatedDocumentsByUrl.map((document) => {
                    const score = calculateRelevanceScore(document.relevance_score, messageLength); // INTO Bucket
                    const bucket = getBucketForScorePercentile(score);
                    return (
                        <AttributionDocumentCard
                            key={document.index}
                            document={document}
                            relevanceBucket={bucket}
                        />
                    );
                })}
            </Box>
        </AttributionContentStack>
    );
};

export const FullAttributionContent = () => {
    const shouldShowRepeatedDocuments = useAppContext(
        (state) => state.attribution.selectedRepeatedDocumentIndex != null
    );

    return (
        <>
            {/* These are in separate boxes so they have separate scroll states.
                When RepeatedAttributionDocumentsContent is opened, it should be at the top of its content.
                When it's closed, we should go back to where we were in AttributionContent */}
            <Box
                sx={{
                    // This sticks around so we can preserve its scroll state. If we remove it from rendering entirely it'll reset
                    display: shouldShowRepeatedDocuments ? 'none' : undefined,
                    height: 1,
                }}>
                <AttributionContent />
            </Box>
            {shouldShowRepeatedDocuments && (
                <Box
                    sx={{
                        height: 1,
                        overflowY: 'auto',
                    }}>
                    <RepeatedAttributionDocumentsContent />
                </Box>
            )}
        </>
    );
};
