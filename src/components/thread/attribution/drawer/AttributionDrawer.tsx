import { ArrowBack } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    IconButton,
    Link,
    ListSubheader,
    Stack,
    Typography,
} from '@mui/material';
import { useShallow } from 'zustand/react/shallow';

import { useAppContext } from '@/AppContext';
import { FullScreenDrawer, FullScreenDrawerHeader } from '@/components/TemporaryDrawer';
import { RemoteState } from '@/contexts/util';
import { links } from '@/Links';

import { AttributionDocumentCard } from './AttributionDocumentCard/AttributionDocumentCard';
import { AttributionDrawerDocumentList } from './AttributionDrawerDocumentList';
import { ClearSelectedSpanButton } from './ClearSelectedSpanButton';
import {
    messageAttributionDocumentsSelector,
    useAttributionDocumentsForMessage,
} from './message-attribution-documents-selector';

export const ATTRIBUTION_DRAWER_ID = 'attribution';

export const AttributionDrawer = () => {
    const shouldShowRepeatedDocuments = useAppContext(
        (state) => state.attribution.selectedRepeatedDocumentIndex != null
    );

    return (
        <FullScreenDrawer
            drawerId="attribution"
            header={({ onDrawerClose }) => (
                <FullScreenDrawerHeader>
                    <Stack
                        justifyContent="space-between"
                        direction="row"
                        gap={2}
                        alignItems="center">
                        <ListSubheader sx={{ paddingBlock: 2, backgroundColor: 'transparent' }}>
                            <Typography component="h2" variant="h5" margin={0} color="primary">
                                CorpusLink
                            </Typography>
                        </ListSubheader>
                        <IconButton
                            onClick={onDrawerClose}
                            sx={{ color: 'inherit' }}
                            aria-label="close CorpusLink drawer">
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                    <Divider />
                </FullScreenDrawerHeader>
            )}>
            {shouldShowRepeatedDocuments ? (
                <RepeatedAttributionDocumentsContent />
            ) : (
                <AttributionContent />
            )}
        </FullScreenDrawer>
    );
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

    return (
        <Stack direction="column" gap={2} paddingBlock={2} data-testid="repeated-documents-drawer">
            <Button
                onClick={resetSelectedRepeatedDocument}
                variant="text"
                color="inherit"
                sx={{
                    justifyContent: 'start',
                }}>
                <ArrowBack />
                &nbsp;Back to CorpusLink documents
            </Button>
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
