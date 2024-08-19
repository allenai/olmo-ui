import CloseIcon from '@mui/icons-material/Close';
import { Box, Divider, IconButton, ListSubheader, Stack, Typography } from '@mui/material';
import { KeyboardEventHandler } from 'react';

import { useAppContext } from '@/AppContext';
import { ResponsiveDrawer } from '@/components/ResponsiveDrawer';
import { useCloseDrawerOnNavigation } from '@/utils/useClosingDrawerOnNavigation-utils';

import { AttributionDrawerDocumentList } from './AttributionDrawerDocumentList';
import { ClearSelectedSpanButton } from './ClearSelectedSpanButton';

export const ATTRIBUTION_DRAWER_ID = 'attribution';

export const AttributionDrawer = () => {
    const closeDrawer = useAppContext((state) => state.closeDrawer);
    const isDrawerOpen = useAppContext(
        (state) => state.currentOpenDrawer === ATTRIBUTION_DRAWER_ID
    );

    const handleDrawerClose = () => {
        closeDrawer(ATTRIBUTION_DRAWER_ID);
    };

    useCloseDrawerOnNavigation({
        handleDrawerClose,
    });

    const onKeyDownEscapeHandler: KeyboardEventHandler = (
        event: React.KeyboardEvent<HTMLDivElement>
    ) => {
        if (event.key === 'Escape') {
            handleDrawerClose();
        }
    };

    return (
        <ResponsiveDrawer
            open={isDrawerOpen}
            onClose={handleDrawerClose}
            onKeyDownHandler={onKeyDownEscapeHandler}
            anchor="right"
            desktopDrawerVariant="persistent"
            desktopDrawerSx={{ gridArea: 'side-drawer' }}
            heading={
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
                            <Typography variant="h5" margin={0} color="primary">
                                Attribution
                            </Typography>
                        </ListSubheader>
                        <IconButton
                            onClick={handleDrawerClose}
                            sx={{ color: 'inherit' }}
                            aria-label="close drawer">
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                    <Divider />
                </Box>
            }>
            <Stack
                marginInline={2}
                direction="column"
                gap={2}
                paddingBlock={2}
                data-testid="attribution-drawer">
                <Typography>
                    Select a document from this list to highlight which parts of the model’s
                    response have an exact text match in the training data
                </Typography>
                <ClearSelectedSpanButton />
                <AttributionDrawerDocumentList />
            </Stack>
        </ResponsiveDrawer>
    );
};
