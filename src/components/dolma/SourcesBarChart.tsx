import { Box, LinearProgress, Typography } from '@mui/material';
import { BarCustomLayerProps, ResponsiveBar } from '@nivo/bar';
import { LoaderFunction, useLoaderData, useNavigation } from 'react-router-dom';

import { staticData } from '@/api/dolma/staticData';
import { StaticDataClient } from '@/api/dolma/StaticDataClient';
import { DESKTOP_LAYOUT_BREAKPOINT, SMALL_LAYOUT_BREAKPOINT } from '@/constants';

import { ResponsiveCard } from '../ResponsiveCard';
import { ChartContainerSansLegend } from './sharedCharting';

export interface BarData {
    id: string;
    label: string;
    value: number;
    color: string;
}

export const SourcesBarChart = () => {
    const sourcesData = (useLoaderData() || []) as BarData[];
    const navigation = useNavigation();

    const isLoading = navigation.state === 'loading';

    // Calculate the total sum of all data values
    const totalSum = sourcesData.reduce((acc, item) => acc + item.value, 0);

    // Custom tick format function to display percentages
    const formatValueAsPercentage = (value: number) => {
        const percentage = (value / totalSum) * 100;
        return `${percentage.toFixed(2)}%`;
    };
    // Custom layer to draw the left axis line
    const customLeftAxisLayer = ({ innerHeight }: BarCustomLayerProps<BarData>) => {
        return <line x1={0} y1={0} x2={0} y2={innerHeight} stroke="#000000" strokeWidth={1} />;
    };

    // Calculate tick values for the left axis
    // This creates an array with the tick values, ensuring that the tick values are evenly distributed from 0 to totalSum value of all sources.
    // This array then will be used to display in % for the left axis value
    const tickValues = [0, totalSum / 4, (totalSum * 2) / 4, (totalSum * 3) / 4, totalSum];

    if (isLoading) {
        return <LinearProgress />;
    }

    return (
        <ResponsiveCard>
            <Box
                sx={(theme) => ({
                    width: '100%',
                    maxWidth: '100%',
                    margin: '0 auto',
                    [theme.breakpoints.down(SMALL_LAYOUT_BREAKPOINT)]: {
                        width: '100%',
                    },
                    [theme.breakpoints.up(SMALL_LAYOUT_BREAKPOINT)]: {
                        width: '100%',
                    },
                    [theme.breakpoints.up('md')]: {
                        width: '90%',
                    },
                    [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                        width: '55%',
                    },
                })}>
                <Typography variant="h3" sx={{ marginBottom: '-36px' }}>
                    Sources
                </Typography>
                <ChartContainerSansLegend>
                    <ResponsiveBar
                        data={sourcesData.map((item) => ({ ...item }))}
                        keys={['value']}
                        indexBy="label"
                        label={({ data }) => formatValueAsPercentage(data.value)}
                        labelSkipWidth={0}
                        labelSkipHeight={0}
                        padding={0.1}
                        colors={({ data }) => data.color}
                        margin={{ top: 50, right: 30, bottom: 100, left: 110 }}
                        groupMode="grouped"
                        axisLeft={{
                            tickValues,
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: '% of Documents in Dataset',
                            legendPosition: 'middle',
                            legendOffset: -70,
                            format: formatValueAsPercentage,
                        }}
                        axisBottom={{
                            tickSize: 0,
                            tickPadding: 15,
                            tickRotation: 40.75,
                            legend: 'Sources',
                            legendPosition: 'middle',
                            legendOffset: 80,
                            truncateTickAt: 0,
                            format: (value) => value, // Ensure all labels are shown
                        }}
                        enableGridX={false}
                        enableGridY={false}
                        enableLabel={true}
                        minValue={0}
                        maxValue="auto"
                        layers={[
                            'grid',
                            'axes',
                            'bars',
                            'markers',
                            'legends',
                            'annotations',
                            customLeftAxisLayer,
                        ]}
                        // Add accessibility attributes
                        aria-label="Bar Chart representing sources data"
                    />
                </ChartContainerSansLegend>
            </Box>
        </ResponsiveCard>
    );
};

export const SourcesBarChartLoader: LoaderFunction = async (): Promise<Response> => {
    try {
        const api = new StaticDataClient();

        const sources = await api.getSources();

        const newSources = Object.fromEntries(
            Object.entries(sources).filter(([_k, v]) =>
                v.staticData.includes(staticData.StaticDataType.SourceCounts)
            )
        );

        const newData: BarData[] = [];
        const data = await api.getSourceCounts();
        Object.entries(data).forEach(([k, v]) => {
            if (newSources[k]) {
                newData.push({
                    id: k,
                    label: newSources[k].label,
                    value: v,
                    color: newSources[k].color,
                });
            }
        });

        return new Response(JSON.stringify(newData), {
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
