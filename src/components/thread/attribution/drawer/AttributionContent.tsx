import { ArrowBack } from '@mui/icons-material';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, Button, Card, CardContent, Link, Stack, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useAppContext } from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import { links } from '@/Links';

import { AttributionDocumentCard } from './AttributionDocumentCard/AttributionDocumentCard';
import { AttributionDrawerDocumentList } from './AttributionDrawerDocumentList';
import { ClearSelectedSpanButton } from './ClearSelectedSpanButton';
import {
    messageAttributionDocumentsSelector,
    useAttributionDocumentsForMessage,
} from './message-attribution-documents-selector';

export const useResetScrollWhenOpeningRepeatedDocuments = () => {
    const shouldShowRepeatedDocuments = useAppContext(
        (state) => state.attribution.selectedRepeatedDocumentIndex != null
    );

    const containerRef = useRef<HTMLDivElement>(null);
    const scrollPosition = useRef<number | null>(null);

    const saveScrollPosition = () => {
        if (containerRef.current != null) {
            scrollPosition.current = containerRef.current.scrollTop;
            console.log('save position', scrollPosition.current, containerRef.current.scrollTop);
            // containerRef.current.scrollTop = 0;
        }
    };

    const restoreScrollPosition = () => {
        if (containerRef.current != null && scrollPosition.current != null) {
            console.log('restore position', scrollPosition.current);
            containerRef.current.scrollTo({ top: scrollPosition.current });
        }
    };

    const scrollToTop = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = 0;
        }
    };

    return {
        containerRef,
        shouldShowRepeatedDocuments,
        saveScrollPosition,
        restoreScrollPosition,
        scrollToTop,
    };
};
export const AttributionContent = () => {
    const toggleHighlightVisibility = useAppContext((state) => state.toggleHighlightVisibility);
    const attributionForMessage = useAppContext(messageAttributionDocumentsSelector);
    const isAllHighlightVisible = useAppContext((state) => state.attribution.isAllHighlightVisible);

    const { loadingState } = attributionForMessage;

    return (
        <Stack direction="column" gap={2} paddingBlock={2} data-testid="attribution-drawer">
            <Typography variant="h5">Text matches from pre-training data</Typography>
            <Typography>
                Select a highlight from the model response to see the documents from the
                pre-training data that have exact text matches in the model response.
            </Typography>
            <Link href={links.faqs} underline="always">
                <Typography variant="caption">Learn more</Typography>
            </Link>
            <Card>
                <CardContent
                    sx={{
                        backgroundColor: (theme) => theme.palette.background.reversed,
                        '&:last-child': {
                            padding: (theme) => theme.spacing(2),
                        },
                    }}>
                    <Typography color="white">Want to see more pre-training data?</Typography>
                    <Button
                        variant="contained"
                        href={links.datasetExplorer}
                        sx={(theme) => ({
                            backgroundColor: theme.palette.secondary.light,
                            '&:hover': {
                                backgroundColor: theme.palette.secondary.light,
                            },
                            marginTop: theme.spacing(2),
                        })}>
                        <Typography fontWeight={500}>Explore the full dataset</Typography>
                    </Button>
                </CardContent>
            </Card>
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
                }}>
                {isAllHighlightVisible ? 'Hide Highlights' : 'Show Highlights'}
            </Button>
            <ClearSelectedSpanButton />
            <AttributionDrawerDocumentList />
        </Stack>
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
        <Stack direction="column" gap={2} paddingBlock={2} data-testid="repeated-documents-drawer">
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
        </Stack>
    );
};

export const FullAttributionContent = () => {
    const shouldShowRepeatedDocuments = useAppContext(
        (state) => state.attribution.selectedRepeatedDocumentIndex != null
    );

    return (
        <>
            <Box
                sx={{
                    display: shouldShowRepeatedDocuments ? 'none' : undefined,
                    height: 1,
                    overflowY: 'auto',
                }}>
                <AttributionContent />
            </Box>
            <Box
                sx={{
                    display: shouldShowRepeatedDocuments ? undefined : 'none',
                    height: 1,
                    overflowY: 'auto',
                }}>
                {shouldShowRepeatedDocuments && <RepeatedAttributionDocumentsContent />}
            </Box>
        </>
    );
};
