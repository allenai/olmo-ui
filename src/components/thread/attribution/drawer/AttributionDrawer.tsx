import CloseIcon from '@mui/icons-material/Close';
import { Divider, IconButton, ListSubheader, Stack, Typography } from '@mui/material';

import { FullScreenDrawer, FullScreenDrawerHeader } from '@/components/FullScreenDrawer';

import { FullAttributionContent } from './AttributionContent';

export const ATTRIBUTION_DRAWER_ID = 'attribution';

export const AttributionDrawer = () => {
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
                            <Typography
                                component="h2"
                                variant="h5"
                                margin={0}
                                color={(theme) => theme.palette.text.primary}>
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
            <FullAttributionContent />
        </FullScreenDrawer>
    );
};
<<<<<<< HEAD
=======

export const AttributionContent = () => {
    const toggleHighlightVisibility = useAppContext((state) => state.toggleHighlightVisibility);
    const attributionForMessage = useAppContext(messageAttributionDocumentsSelector);
    const isAllHighlightVisible = useAppContext((state) => state.isAllHighlightVisible);

    const { loadingState, documents } = attributionForMessage;

    return (
        <Stack direction="column" gap={2} paddingBlock={2} data-testid="attribution-drawer">
            <Typography variant="h5">Text matches from pre-training data</Typography>
            <Typography>
                Select a highlight from the model response to see the documents from the
                pre-training data that have exact text matches in the model response.
            </Typography>
            <Link href={links.faqs + getFAQIdByShortId('corpuslink-intro')} underline="always">
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
                            ':hover': {
                                backgroundColor: theme.color['teal-10'].hex,
                            },
                            ':focus': {
                                backgroundColor: theme.color['green-20'].hex,
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
                    visibility: documents.length === 0 ? 'hidden' : 'visible',
                }}>
                {isAllHighlightVisible ? 'Hide Highlights' : 'Show Highlights'}
            </Button>
            <ClearSelectedSpanButton />
            <AttributionDrawerDocumentList />
        </Stack>
    );
};
>>>>>>> Address PR comments
