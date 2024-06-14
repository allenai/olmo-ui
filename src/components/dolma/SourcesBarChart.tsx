import { LinearProgress } from '@mui/material';
import { BarCustomLayerProps, ResponsiveBar } from '@nivo/bar';
import { LoaderFunction, useLoaderData, useNavigation } from 'react-router-dom';

import { StaticDataClient } from '@/api/dolma/StaticDataClient';

import { staticData } from '../../api/dolma/staticData';
import { ChartContainerSansLegend } from './sharedCharting';

export interface BarData {
    id: string;
    label: string;
    value: number;
    color: string;
}

export const SourcesBarChart = () => {
    const sourcesData = useLoaderData() as BarData[] | undefined;
    const navigation = useNavigation();

    const isLoading = navigation.state === 'loading';

    const data = sourcesData || [];

    // Calculate the total sum of all data values
    const totalSum = data.reduce((acc, item) => acc + item.value, 0);

    // Custom tick format function to display percentages
    const formatValueAsPercentage = (value: number) => `${Math.round((value / totalSum) * 100)}%`;

    // Custom layer to draw the left axis line
    const customLeftAxisLayer = ({ innerHeight }: BarCustomLayerProps<BarData>) => {
        return <line x1={0} y1={0} x2={0} y2={innerHeight} stroke="#000000" strokeWidth={1} />;
    };

    // Calculate tick values for the left axis
    const tickValues = [0, totalSum / 4, (totalSum * 2) / 4, (totalSum * 3) / 4, totalSum];

    if (isLoading) {
        return <LinearProgress />;
    }

    return (
        <ChartContainerSansLegend>
            <ResponsiveBar
                data={data.map((item) => ({ ...item }))}
                keys={['value']}
                indexBy="label"
                label={({ data }) => formatValueAsPercentage(data.value)}
                labelSkipWidth={12}
                labelSkipHeight={12}
                padding={0.5}
                innerPadding={4}
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
                    legendOffset: -50,
                    format: formatValueAsPercentage,
                }}
                axisBottom={{
                    tickSize: 0,
                    tickPadding: 15,
                    tickRotation: 40.75,
                    legend: 'Sources',
                    legendPosition: 'middle',
                    legendOffset: 60,
                    truncateTickAt: 0,
                }}
                enableGridX={false}
                enableGridY={false}
                enableLabel={true}
                layers={[
                    'grid',
                    'axes',
                    'bars',
                    'markers',
                    'legends',
                    'annotations',
                    customLeftAxisLayer,
                ]}
            />
        </ChartContainerSansLegend>
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
