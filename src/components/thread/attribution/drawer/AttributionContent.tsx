import { ArrowBack } from '@mui/icons-material';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, Button, Link, Stack, styled, Typography } from '@mui/material';
import { useShallow } from 'zustand/react/shallow';

import { useAppContext } from '@/AppContext';
import { getFAQIdByShortId } from '@/components/faq/faq-utils';
import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';
import { RemoteState } from '@/contexts/util';
import { links } from '@/Links';

import { AttributionDocumentCard } from './AttributionDocumentCard/AttributionDocumentCard';
import { AttributionDrawerDocumentList } from './AttributionDrawerDocumentList';
import { ClearSelectedSpanButton } from './ClearSelectedSpanButton';
import {
    messageAttributionDocumentsSelector,
    useAttributionDocumentsForMessage,
} from './message-attribution-documents-selector';

const AttributionContentStack = styled(Stack)(({ theme }) => ({
    paddingBlock: theme.spacing(2),
    [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
        padding: 0,
    },
}));

export const AttributionContent = () => {
    const toggleHighlightVisibility = useAppContext((state) => state.toggleHighlightVisibility);
    const attributionForMessage = useAppContext(messageAttributionDocumentsSelector);
    const isAllHighlightVisible = useAppContext((state) => state.attribution.isAllHighlightVisible);

    const { loadingState, documents } = attributionForMessage;

    return (
        <AttributionContentStack direction="column" gap={2} data-testid="attribution-drawer">
            <Typography variant="h5">CorpusLink</Typography>
            <Typography>
                CorpusLink shows documents from the training data that have exact text matches with
                the model response. Select a highlight to view its documents.
            </Typography>
            <Typography variant="body2">
                CorpusLink might retrieve documents that can be used to fact check parts of the
                model&apos;s response, if the response contains simple facts. However, creative
                generations (e.g. writing a poem) or novel generations (e.g. writing code) likely
                cannot be fact checked by looking at these retrieved documents.
            </Typography>
            <Typography variant="body2">
                The model did not have direct access to these documents when generating the
                response. Documents are retrieved after the response generation.{' '}
                <Link href={links.faqs + getFAQIdByShortId('corpuslink-intro')} underline="always">
                    Learn more
                </Link>
            </Typography>
            <Button
                variant="contained"
                href={links.datasetExplorer}
                color="secondary"
                disableRipple={true}
                sx={(theme) => ({
                    marginTop: theme.spacing(1),
                })}>
                <Typography fontWeight={500}>Explore the full training dataset</Typography>
            </Button>
            <Button
                variant="text"
                disabled={loadingState === RemoteState.Loading}
                startIcon={
                    isAllHighlightVisible ? (
                        <VisibilityOffOutlinedIcon />
                    ) : (
                        <VisibilityOutlinedIcon />
                    )
                }
                onClick={toggleHighlightVisibility}
                sx={{
                    justifyContent: 'flex-start',
                    color: (theme) => theme.palette.text.primary,
                    visibility: documents.length === 0 ? 'hidden' : 'visible',
                }}>
                {isAllHighlightVisible ? 'Hide Highlights' : 'Show Highlights'}
            </Button>
            <ClearSelectedSpanButton />
            <AttributionDrawerDocumentList />
        </AttributionContentStack>
    );
};

export const RepeatedAttributionDocumentsContent = () => {
    const attributionForMessage = useAttributionDocumentsForMessage();

    const repeatedDocumentsByUrl = useAppContext(
        useShallow((state) => {
            const selectedRepeatedDocumentIndex = state.attribution.selectedRepeatedDocumentIndex;

            const selectedDocument = attributionForMessage.documents.find(
                (document) => document.index === selectedRepeatedDocumentIndex
            );

            const documentsWithTheSameUrl = attributionForMessage.documents.filter(
                (document) => document.url === selectedDocument?.url
            );

            return documentsWithTheSameUrl;
        })
    );

    const resetSelectedRepeatedDocument = useAppContext(
        (state) => state.resetSelectedRepeatedDocument
    );

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
            <Box p={0} component="ol" sx={{ display: 'contents', listStyleType: 'none' }}>
                {repeatedDocumentsByUrl.map((document) => {
                    return (
                        <AttributionDocumentCard
                            key={document.index}
                            documentIndex={document.index}
                            documentUrl={document.url}
                            source={document.source}
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
