import { Box, Stack, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { LoaderFunction } from 'react-router-dom';

import { staticData } from '@/api/dolma/staticData';
import { StaticDataClient } from '@/api/dolma/StaticDataClient';

import { DomainData, DomainsTable } from './DomainsTable';
import { SearchDataSet } from './SearchDataSet';
import { useDesktopOrUp } from './shared';
import { BarData, SourcesBarChart } from './SourcesBarChart';

export const DolmaTabs = () => {
    const isDesktopOrUp = useDesktopOrUp();
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
            <Box
                sx={{
                    position: 'sticky',
                    top: (theme) => (isDesktopOrUp ? theme.spacing(-4) : 0),
                    zIndex: 1000,
                    borderBottom: 1,
                    borderColor: 'divider',
                    background: (theme) => theme.color2.N1.hex,
                }}>
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
                <Stack id="sources-and-domains" spacing={3}>
                    <SourcesBarChart />
                    <DomainsTable />
                </Stack>
            </Stack>
        </Box>
    );
};

export interface DolmaResponse {
    barData: BarData[];
    domainData: DomainData[];
}

export const DolmaDataLoader: LoaderFunction = async (): Promise<Response> => {
    try {
        const api = new StaticDataClient();

        const sources = await api.getSources();
        const domains = await api.getDomains();
        const newSources = Object.fromEntries(
            Object.entries(sources).filter(([_k, v]) =>
                v.staticData.includes(staticData.StaticDataType.SourceCounts)
            )
        );

        const barData: BarData[] = [];
        const sourceCounts = await api.getSourceCounts();
        Object.entries(sourceCounts).forEach(([k, v]) => {
            if (newSources[k]) {
                barData.push({
                    id: k,
                    label: newSources[k].label,
                    value: v,
                    color: newSources[k].color,
                });
            }
        });

        const domainData: DomainData[] = [];
        Object.entries(domains).forEach(([sourceKey, domainCountPairs]) => {
            Object.entries(domainCountPairs).forEach(([domain, count]) => {
                domainData.push({
                    source: sources[sourceKey].label,
                    domain,
                    docCount: count,
                });
            });
        });

        const dolmaResponse: DolmaResponse = { barData, domainData };

        return new Response(JSON.stringify(dolmaResponse), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error in SourcesBarChartLoader:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
