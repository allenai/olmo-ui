import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
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
    const tabContentRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]); // Ref to hold tab content references

    const handleTabChange = (_event: React.SyntheticEvent, newTabNumber: number) => {
        setTabNumber(newTabNumber);
    };

    useEffect(() => {
        const observerOptions = {
            root: null, // observe within the viewport
            rootMargin: '0px',
            threshold: 0.5, // Adjust threshold as needed
        };

        const callback: IntersectionObserverCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                console.log(entry.target.id, entry.isIntersecting, entry.intersectionRatio); // Log entry details for debugging
                if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
                    const tabId = entry.target.id;
                    const tabIndex = tabContentRefs.current.findIndex((ref) => ref?.id === tabId);
                    if (tabIndex !== -1) {
                        setTabNumber(tabIndex); // Update tabNumber to reflect visible tab
                    }
                }
            });
        };

        const observer = new IntersectionObserver(callback, observerOptions);

        tabContentRefs.current.forEach((tabContentRefs) => {
            if (tabContentRefs) {
                observer.observe(tabContentRefs);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, [tabContentRefs.current]); // Include tabsRef.current in the dependency array

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
                    marginBottom: (theme) => theme.spacing(2),
                    zIndex: 1000,
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
                <Box
                    id="search-dataset"
                    ref={(element: HTMLDivElement) => {
                        if (element) tabContentRefs.current[0] = element;
                    }}>
                    <SearchDataSet />
                </Box>
                <Box
                    id="sources"
                    ref={(element: HTMLDivElement) => {
                        if (element) tabContentRefs.current[1] = element;
                    }}>
                    <SourcesBarChart />
                </Box>
                <Box
                    id="domains"
                    ref={(element: HTMLDivElement) => {
                        if (element) tabContentRefs.current[2] = element;
                    }}>
                    <DomainsTable />
                </Box>
                <Box
                    id="document-length"
                    ref={(element: HTMLDivElement) => {
                        if (element) tabContentRefs.current[3] = element;
                    }}>
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
