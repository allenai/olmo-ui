import { BarCustomLayerProps, ResponsiveBar } from '@nivo/bar';

import { staticData } from '../../api/dolma/staticData';
import { ChartContainerSansLegend } from './sharedCharting';

export interface BarData {
    id: string;
    label: string;
    value: number;
    color: string;
}

interface Props {
    data: BarData[];
    sourceMap: staticData.Sources;
}

export const SourcesBarChart = ({ data }: Props) => {
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
