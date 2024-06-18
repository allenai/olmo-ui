import { Box, Stack, Tab, Tabs } from '@mui/material';
import { useState } from 'react';

import { SearchDataSet } from './SearchDataSet';
import { SourcesBarChart } from './SourcesBarChart';

export const DolmaTabs = () => {
    const [tabNumber, setTabNumber] = useState<number>(0);

    const handleTabChange = (_event: React.SyntheticEvent, newTabNumber: number) => {
        setTabNumber(newTabNumber);
    };

    const handleTabClick = (event: React.MouseEvent<HTMLDivElement>, tabId: string) => {
        event.preventDefault();
        const element = document.getElementById(tabId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={tabNumber}
                    onChange={handleTabChange}
                    aria-label="Dataset Explorer Pages">
                    <Tab
                        label="Search Dataset"
                        onClick={(event) => {
                            handleTabClick(event, 'search-dataset');
                        }}
                    />
                    <Tab
                        label="Sources and Domains"
                        onClick={(event) => {
                            handleTabClick(event, 'sources-and-domains');
                        }}
                    />
                </Tabs>
            </Box>
            <Stack gap={2}>
                <Box id="search-dataset">
                    <SearchDataSet />
                </Box>
                <Box id="sources-and-domains">
                    <SourcesBarChart />
                </Box>
            </Stack>
        </Box>
    );
};
