import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import { json, LoaderFunction } from 'react-router-dom';

import { staticData } from '@/api/dolma/staticData';
import { StaticDataClient } from '@/api/dolma/StaticDataClient';

import { ResponsiveCard } from '../ResponsiveCard';
import { DomainData, DomainsTable } from './DomainsTable';
import { SearchDataSet } from './SearchDataSet';
import { useDesktopOrUp } from './shared';
import { DistData, getDistAndMapDistData, MapDistData } from './sharedCharting';
import { BarData, SourcesBarChart } from './SourcesBarChart';
import { WordDist } from './WordDist';

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
                        label="Sources"
                        onClick={(event) => {
                            handleTabClick(event, 'sources');
                        }}
                    />
                    <Tab
                        label="Domains"
                        onClick={(event) => {
                            handleTabClick(event, 'domains');
                        }}
                    />
                    <Tab
                        label="Document Length"
                        onClick={(event) => {
                            handleTabClick(event, 'document-length');
                        }}
                    />
                </Tabs>
            </Box>
            <Stack gap={2}>
                <Box id="search-dataset">
                    <SearchDataSet />
                </Box>
                <Box id="sources">
                    <SourcesBarChart />
                </Box>
                <Box id="domains">
                    <DomainsTable />
                </Box>
                <Box id="document-length">
                    <ResponsiveCard>
                        <Typography variant="h3">Document Length</Typography>
                        <WordDist />
                    </ResponsiveCard>
                </Box>
            </Stack>
        </Box>
    );
};

interface DocumentLengthData {
    distData: DistData[];
    mapDistData: MapDistData;
    sources: staticData.Sources;
}
export interface DolmaResponse {
    barData: BarData[];
    domainData: DomainData[];
    documentLengthData: DocumentLengthData;
}

export const DolmaDataLoader: LoaderFunction = async (): Promise<Response> => {
    try {
        const api = new StaticDataClient();

        const sources = await api.getSources();
        const domains = await api.getDomains();
        const words = await api.getWords();

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

        const [distData, mapDistData] = getDistAndMapDistData(words, (n: number) =>
            n.toLocaleString()
        );

        const dolmaResponse: DolmaResponse = {
            barData,
            domainData,
            documentLengthData: {
                distData,
                mapDistData,
                sources: newSources,
            },
        };

        return json(dolmaResponse, { status: 200 });
    } catch (error) {
        console.error('Error in DolmaDataLoader:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
};
