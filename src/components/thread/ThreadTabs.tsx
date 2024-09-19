import { Tab, TabPanel, Tabs, TabsList } from '@mui/base';
import { Box, styled, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { useAppContext } from '@/AppContext';
import { DrawerId } from '@/slices/DrawerSlice';

import { AttributionContent } from './attribution/drawer/AttributionDrawer';
import { ParameterContent } from './parameter/ParameterDrawer';

const PARAMETERS_TAB_NAME: DrawerId = 'parameters';
const DATASET_TAB_NAME: DrawerId = 'attribution';

type ThreadTabName = typeof PARAMETERS_TAB_NAME | typeof DATASET_TAB_NAME;

export const ThreadTabs = () => {
    const [currentTab, setCurrentTab] = useState<ThreadTabName>(PARAMETERS_TAB_NAME);

    const currentOpenGlobalDrawer = useAppContext(
        (state) => state.currentOpenDrawer as ThreadTabName
    );
    const setCurrentOpenGlobalDrawer = useAppContext((state) => state.openDrawer);

    useEffect(() => {
        if ([PARAMETERS_TAB_NAME, DATASET_TAB_NAME].includes(currentOpenGlobalDrawer)) {
            setCurrentTab(currentOpenGlobalDrawer);
        }
    }, [currentOpenGlobalDrawer, setCurrentTab]);

    return (
        <Box sx={{ gridArea: 'aside', minHeight: 0 }} bgcolor="background.default">
            <TabsWithOverflow
                value={currentTab}
                // defaultValue={currentTab}
                onChange={(e, value) => {
                    if (value != null && typeof value === 'string') {
                        setCurrentOpenGlobalDrawer(value as ThreadTabName);
                        setCurrentTab(value as ThreadTabName);
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
                            Dataset
                        </Typography>
                    </TabControl>
                </StickyTabsList>

                <TabPanelWithOverflow
                    value={PARAMETERS_TAB_NAME}
                    aria-labelledby="parameters-tab-control"
                    id="parameters-tabpanel">
                    <ParameterContent />
                </TabPanelWithOverflow>
                <TabPanelWithOverflow
                    value={DATASET_TAB_NAME}
                    aria-labelledby="dataset-tab-control"
                    id="parameters-tabpanel">
                    <AttributionContent />
                </TabPanelWithOverflow>
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
    scrollbarGutter: 'stable both-edges',
    '& > *': {
        marginInline: theme.spacing(2),
    },
}));
