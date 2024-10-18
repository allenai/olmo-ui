import { Tab, TabPanel, Tabs, TabsList } from '@mui/base';
import { Box, styled, Typography } from '@mui/material';

import { useAppContext } from '@/AppContext';
import { ThreadTabId } from '@/slices/DrawerSlice';

import {
    AttributionContent,
    RepeatedAttributionDocumentsContent,
    useResetScrollWhenOpeningRepeatedDocuments,
} from './attribution/drawer/AttributionDrawer';
import { ParameterContent } from './parameter/ParameterDrawer';

const PARAMETERS_TAB_NAME: ThreadTabId = 'parameters';
const DATASET_TAB_NAME: ThreadTabId = 'attribution';

const AttributionTab = () => {
    const { shouldShowRepeatedDocuments, containerRef } =
        useResetScrollWhenOpeningRepeatedDocuments();

    return (
        <TabPanelWithOverflow
            ref={containerRef}
            value={DATASET_TAB_NAME}
            aria-labelledby="dataset-tab-control"
            id="parameters-tabpanel">
            {shouldShowRepeatedDocuments ? (
                <RepeatedAttributionDocumentsContent />
            ) : (
                <AttributionContent />
            )}
        </TabPanelWithOverflow>
    );
};

export const ThreadTabs = () => {
    const currentOpenThreadTab = useAppContext((state) => state.currentOpenThreadTab);
    const setCurrentOpenGlobalDrawer = useAppContext((state) => state.openDrawer);

    return (
        <Box sx={{ gridArea: 'aside', minHeight: 0 }} bgcolor="background.default">
            <TabsWithOverflow
                value={currentOpenThreadTab}
                onChange={(e, value) => {
                    if (value != null && typeof value === 'string') {
                        setCurrentOpenGlobalDrawer(value as ThreadTabId);
                    }
                }}>
                <StickyTabsList>
                    <TabControl value={PARAMETERS_TAB_NAME} id="parameters-tab-control">
                        <Typography variant="h4" component="span">
                            Parameters
                        </Typography>
                    </TabControl>
                    <TabControl value={DATASET_TAB_NAME} id="dataset-tab-control">
                        <Typography variant="h4" component="span">
                            CorpusLink
                        </Typography>
                    </TabControl>
                </StickyTabsList>

                <TabPanelWithOverflow
                    value={PARAMETERS_TAB_NAME}
                    aria-labelledby="parameters-tab-control"
                    id="parameters-tabpanel">
                    <ParameterContent />
                </TabPanelWithOverflow>
                <AttributionTab />
            </TabsWithOverflow>
        </Box>
    );
};

const StickyTabsList = styled(TabsList)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    display: 'flex',
}));

const TabControl = styled(Tab)(({ theme }) => ({
    paddingBlock: theme.spacing(3),
    paddingInline: theme.spacing(2),
    border: 0,
    flexGrow: 1,

    color: theme.palette.primary.dark,
    backgroundColor: theme.palette.background.paper,

    cursor: 'pointer',

    '&[aria-selected="true"]': {
        backgroundColor: theme.palette.background.default,
        color: 'inherit',
        borderTopLeftRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
    },
}));

const TabsWithOverflow = styled(Tabs)({
    display: 'flex',
    flexFlow: 'column nowrap',
    height: '100%',
    // We need this so the children won't automatically take up all the space they can
    overflow: 'hidden',
});

const TabPanelWithOverflow = styled(TabPanel)(({ theme }) => ({
    overflowY: 'auto',
    overflowX: 'hidden',
    scrollbarGutter: 'stable both-edges',
    '& > *': {
        paddingInline: theme.spacing(2),
    },
}));
