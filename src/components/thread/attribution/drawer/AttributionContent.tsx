import { ArrowBack } from '@mui/icons-material';
import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Link,
    Stack,
    styled,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useAppContext } from '@/AppContext';
import { getFAQIdByShortId } from '@/components/faq/faq-utils';
import { StandardModal } from '@/components/StandardModal';
import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';
import { useFeatureToggles } from '@/FeatureToggleContext';
import { links } from '@/Links';
import {
    messageAttributionsSelector,
    messageLengthSelector,
} from '@/slices/attribution/attribution-selectors';

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
            <DialogTitle variant="h4" sx={{ paddingInline: 0 }}>
                Training text matches
            </DialogTitle>
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
                    response. Documents are retrieved after the response generation. <br />
                    <Link
                        href={links.faqs + getFAQIdByShortId('corpuslink-intro')}
                        underline="always">
                        Learn more
                    </Link>
                </Typography>
            </DialogContent>
            <DialogActions sx={{ paddingInline: 0 }}>
                <Button variant="text" onClick={handleClose}>
                    Close
                </Button>
            </DialogActions>
        </StandardModal>
    );
};

export const AttributionContent = () => {
    const [open, setOpen] = useState<boolean>(false);
    const { isDatasetExplorerEnabled } = useFeatureToggles();
    const closeModal = () => {
        setOpen(false);
    };

    return (
        <AttributionContentStack direction="column" gap={2} data-testid="corpuslink-drawer">
            <Stack direction="column" gap={2} paddingInline={3}>
                <Typography variant="h5">Training text matches</Typography>
                <Typography variant="body2">
                    Documents from the training data that have exact text matches with the model
                    response. <br />
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
    const attributionIndex = useAppContext((state) => messageAttributionsSelector(state)?.index);

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
                &nbsp;Back to CorpusLink documents
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
                            documentId={document.index}
                            source={document.source}
                            index={attributionIndex ?? null}
                            releavanceBucket={bucket}
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
                    overflowY: 'auto',
                    scrollbarGutter: 'stable',
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
