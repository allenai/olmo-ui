import { Tab, TabPanel, Tabs, TabsList } from '@mui/base';
import { styled, Typography } from '@mui/material';

import { useAppContext } from '@/AppContext';
import { useFeatureToggles } from '@/FeatureToggleContext';
import { ThreadTabId } from '@/slices/DrawerSlice';

import { tabRoundedBorderStyle } from '../invertedBorderRadius';
import { FullAttributionContent } from './attribution/drawer/AttributionContent';
import { ParameterContent } from './parameter/ParameterDrawer';

const PARAMETERS_TAB_NAME: ThreadTabId = 'parameters';
const DATASET_TAB_NAME: ThreadTabId = 'attribution';

export const ThreadTabs = () => {
    const { isCorpusLinkEnabled } = useFeatureToggles();
    const setCurrentOpenGlobalDrawer = useAppContext((state) => state.openDrawer);

    const currentOpenThreadTab = useAppContext((state): ThreadTabId => {
        // This handles cases where we automatically open the CorpusLink tab
        // Since our zustand store doesn't know about feature toggles we need to do checks in components that do have access
        const currentOpenThreadTab = state.currentOpenThreadTab;

        if (currentOpenThreadTab === 'attribution' && !isCorpusLinkEnabled) {
            return 'parameters';
        } else {
            return currentOpenThreadTab;
        }
    });

    return (
        <TabsWithOverflow
            value={currentOpenThreadTab}
            onChange={(_e, value) => {
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
                {isCorpusLinkEnabled && (
                    <TabControl value={DATASET_TAB_NAME} id="dataset-tab-control">
                        <Typography variant="h4" component="span">
                            CorpusLink
                        </Typography>
                    </TabControl>
                )}
            </StickyTabsList>
            <TabPanelWithOverflow
                value={PARAMETERS_TAB_NAME}
                aria-labelledby="parameters-tab-control"
                id="parameters-tabpanel"
                sx={{
                    borderTopLeftRadius: '0',
                }}>
                <ParameterContent />
            </TabPanelWithOverflow>
            {isCorpusLinkEnabled && (
                <TabPanelWithOverflow
                    value={DATASET_TAB_NAME}
                    aria-labelledby="dataset-tab-control"
                    id="parameters-tabpanel"
                    sx={{
                        borderTopRightRadius: '0',
                    }}>
                    <FullAttributionContent />
                </TabPanelWithOverflow>
            )}
        </TabsWithOverflow>
    );
};

const StickyTabsList = styled(TabsList)({
    backgroundColor: 'transparent',
    width: '100%',
    display: 'flex',
});

const TabControl = styled(Tab)(({ theme }) => ({
    paddingBlock: theme.spacing(3),
    paddingInline: theme.spacing(2),
    border: 0,
    flexGrow: 1,

    color: theme.palette.primary.dark,
    backgroundColor: 'inherit',

    cursor: 'pointer',
    position: 'relative',

    ':only-of-type': {
        textAlign: 'start',
    },

    '&[aria-selected="true"]': {
        backgroundColor: theme.palette.background.drawer.secondary,
        color: 'inherit',
        borderTopLeftRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
        zIndex: 1,
    },

    ...tabRoundedBorderStyle,
}));

const TabsWithOverflow = styled(Tabs)(() => ({
    display: 'flex',
    flexFlow: 'column nowrap',
    height: '100%',
    gridArea: 'aside',
    width: '320px',
}));

const TabPanelWithOverflow = styled(TabPanel)(({ theme }) => ({
    minHeight: 0,
    borderRadius: theme.spacing(0.5),
    paddingBlock: theme.spacing(2),
    backgroundColor: theme.palette.background.drawer.secondary,
    flexGrow: 1,
    '& > *': {
        paddingInline: theme.spacing(2),
    },
}));
