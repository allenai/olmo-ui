import CloseIcon from '@mui/icons-material/Close';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
    Box,
    Button,
    Divider,
    Drawer,
    IconButton,
    Link,
    ListSubheader,
    Stack,
    Typography,
} from '@mui/material';

import { useAppContext } from '@/AppContext';
import { TemporaryDrawer } from '@/components/TemporaryDrawer';
import { RemoteState } from '@/contexts/util';

import { AttributionDrawerDocumentList } from './AttributionDrawerDocumentList';
import { ClearSelectedSpanButton } from './ClearSelectedSpanButton';
import { messageAttributionDocumentsSelector } from './message-attribution-documents-selector';

export const ATTRIBUTION_DRAWER_ID = 'attribution';

export const AttributionDrawer = () => {
    return (
        <TemporaryDrawer
            drawerId="attribution"
            header={({ onDrawerClose }) => (
                <Box
                    sx={{
                        position: 'sticky',
                        top: 0,
                        backgroundColor: 'inherit',
                        zIndex: 1,
                    }}>
                    <Stack
                        justifyContent="space-between"
                        direction="row"
                        gap={2}
                        alignItems="center">
                        <ListSubheader sx={{ paddingBlock: 2, backgroundColor: 'transparent' }}>
                            <Typography component="h2" variant="h5" margin={0} color="primary">
                                Attribution
                            </Typography>
                        </ListSubheader>
                        <IconButton
                            onClick={onDrawerClose}
                            sx={{ color: 'inherit' }}
                            aria-label="close attribution drawer">
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                    <Divider />
                </Box>
            )}>
            <AttributionContent />
        </TemporaryDrawer>
    );
};

export const AttributionContent = () => {
    const toggleHighlightVisibility = useAppContext((state) => state.toggleHighlightVisibility);
    const attributionForMessage = useAppContext(messageAttributionDocumentsSelector);
    const isAllHighlightVisible = useAppContext((state) => state.isAllHighlightVisible);

    const { loadingState } = attributionForMessage;

    return (
        <Stack direction="column" gap={2} paddingBlock={2} data-testid="attribution-drawer">
            <Typography variant="h5">Text matches from pre-training data</Typography>
            <Typography>
                Select a highlight from the model response to see the documents from the
                pre-training data that have exact text matches in the mode response.
            </Typography>
            <Link href={links.faqs} underline="always">
                <Typography variant="caption">Learn more</Typography>
            </Link>
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
