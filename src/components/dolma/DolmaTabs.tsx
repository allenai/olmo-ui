import { Box, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { json, LoaderFunction } from 'react-router-dom';

import { staticData } from '@/api/dolma/staticData';
import { StaticDataClient } from '@/api/dolma/StaticDataClient';

import { ResponsiveCard } from '../ResponsiveCard';
import { DomainData, DomainsTable } from './DomainsTable';
import { SearchForm } from './SearchForm';
import { useDesktopOrUp } from './shared';
import { DistData, getDistAndMapDistData, MapDistData } from './sharedCharting';
import { BarData, SourcesBarChart } from './SourcesBarChart';
import { WordDist } from './WordDist';

export const DolmaTabs = () => {
    const theme = useTheme();
    const [tabNumber, setTabNumber] = useState<number>(0);
    const tabContentRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);

    const isDesktop = useDesktopOrUp();

    const handleTabChange = (_event: React.SyntheticEvent, newTabNumber: number) => {
        setTabNumber(newTabNumber);
    };

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5,
        };

        const callback: IntersectionObserverCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
                    const tabId = entry.target.id;
                    const tabIndex = tabContentRefs.current.findIndex((ref) => ref?.id === tabId);
                    if (tabIndex !== -1) {
                        setTabNumber(tabIndex);
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
    }, [tabContentRefs.current]);

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
                    top: 0,
                    marginBottom: (theme) => theme.spacing(isDesktop ? 4 : 2),
                    background: (theme) =>
                        isDesktop
                            ? theme.palette.background.paper
                            : theme.palette.background.default,
                    borderBottom: (theme) => `1px solid ${theme.palette.grey[600]}`,
                    zIndex: 1000,
                }}>
                <Tabs
                    value={tabNumber}
                    onChange={handleTabChange}
                    aria-label="Dataset Explorer Pages"
                    sx={{
                        marginBottom: '-1px',
                    }}>
                    <Tab
                        label="Search dataset"
                        onClick={(event) => {
                            handleTabClick(event, 'search-dataset');
                        }}
                        sx={{
                            ...theme.typography.subtitle2,
                        }}
                    />
                    <Tab
                        label="Sources"
                        onClick={(event) => {
                            handleTabClick(event, 'sources');
                        }}
                        sx={{
                            ...theme.typography.subtitle2,
                        }}
                    />
                    <Tab
                        label="Web domains"
                        onClick={(event) => {
                            handleTabClick(event, 'domains');
                        }}
                        sx={{
                            ...theme.typography.subtitle2,
                        }}
                    />
                    <Tab
                        label="Document length"
                        onClick={(event) => {
                            handleTabClick(event, 'document-length');
                        }}
                        sx={{
                            ...theme.typography.subtitle2,
                        }}
                    />
                </Tabs>
            </Box>
            <Stack gap={isDesktop ? 4 : 2}>
                <Box
                    id="search-dataset"
                    ref={(element: HTMLDivElement) => {
                        tabContentRefs.current[0] = element;
                    }}>
                    <SearchForm />
                </Box>
                <Box
                    id="sources"
                    ref={(element: HTMLDivElement) => {
                        tabContentRefs.current[1] = element;
                    }}>
                    <SourcesBarChart />
                </Box>
                <Box
                    id="domains"
                    ref={(element: HTMLDivElement) => {
                        tabContentRefs.current[2] = element;
                    }}>
                    <DomainsTable />
                </Box>
                <Box
                    id="document-length"
                    ref={(element: HTMLDivElement) => {
                        tabContentRefs.current[3] = element;
                    }}>
                    <ResponsiveCard>
                        <Typography
                            variant="h3"
                            sx={{ color: (theme) => theme.palette.text.primary }}>
                            Document Length
                        </Typography>
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
