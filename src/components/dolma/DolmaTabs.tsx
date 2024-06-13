import { Box, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';

import { TabPanel } from '@/components/TabPanel';

import { SearchDataSet } from './SearchDataSet';
import { SourcesAndDomains } from './SourcesAndDomains';

const tabs = [
    { label: 'Search Dataset', component: <SearchDataSet /> },
    { label: 'Sources And Domains', component: <SourcesAndDomains /> },
];

export const DolmaTabs = () => {
    const [tabNumber, setTabNumber] = useState<number>(0);

    const handleTabChange = (_event: React.SyntheticEvent, newTabNumber: number) => {
        setTabNumber(newTabNumber);
    };

    const a11yProps = (index: number) => ({
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    });

    return (
        <Box sx={{ width: '100%' }}>
            <Box>
                <Tabs value={tabNumber} onChange={handleTabChange} aria-label="custom tabs">
                    {tabs.map((tab, index) => (
                        <Tab key={index} label={tab.label} {...a11yProps(index)} />
                    ))}
                </Tabs>
            </Box>
            {tabs.map((tab, index) => (
                <TabPanel key={index} value={tabNumber} index={index}>
                    {tab.component}
                </TabPanel>
            ))}
        </Box>
    );
};
