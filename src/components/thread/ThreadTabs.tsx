import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import { SyntheticEvent, useState } from 'react';

import { AttributionContent } from './attribution/drawer/AttributionDrawer';
import { ParameterContent } from './parameter/ParameterDrawer';

const PARAMETERS_TAB_NAME = 'parameters';
const DATASET_TAB_NAME = 'dataset';

type ThreadTabName = typeof PARAMETERS_TAB_NAME | typeof DATASET_TAB_NAME;

export const ThreadTabs = () => {
    const [currentTab, setCurrentTab] = useState<ThreadTabName>(PARAMETERS_TAB_NAME);

    const handleChange = (_e: SyntheticEvent, value: ThreadTabName) => {
        setCurrentTab(value);
    };

    return (
        <TabContext value={currentTab}>
            <Box sx={{ gridArea: 'aside', width: '23rem', overflowY: 'auto' }}>
                <TabList onChange={handleChange} sx={{ position: 'sticky', top: 0 }}>
                    <Tab label="Parameters" value={PARAMETERS_TAB_NAME} />
                    <Tab label="Dataset" value={DATASET_TAB_NAME} />
                </TabList>

                <TabPanel value={PARAMETERS_TAB_NAME} sx={{ padding: 0 }}>
                    <ParameterContent />
                </TabPanel>
                <TabPanel value={DATASET_TAB_NAME} sx={{ padding: 0 }}>
                    <AttributionContent />
                </TabPanel>
            </Box>
        </TabContext>
    );
};
