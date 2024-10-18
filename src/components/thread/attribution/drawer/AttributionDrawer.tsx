import CloseIcon from '@mui/icons-material/Close';
import { Divider, IconButton, ListSubheader, Stack, Typography } from '@mui/material';

import { FullScreenDrawer, FullScreenDrawerHeader } from '@/components/TemporaryDrawer';

import {
    AttributionContent,
    RepeatedAttributionDocumentsContent,
    useResetScrollWhenOpeningRepeatedDocuments,
} from './AttributionContent';

export const ATTRIBUTION_DRAWER_ID = 'attribution';

export const AttributionDrawer = () => {
    const { containerRef, shouldShowRepeatedDocuments } =
        useResetScrollWhenOpeningRepeatedDocuments();
    return (
        <FullScreenDrawer
            drawerId="attribution"
            ref={containerRef}
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
