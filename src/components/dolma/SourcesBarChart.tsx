import {
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme,
} from '@mui/material';
import Divider from '@mui/material/Divider';
import { ComputedDatum, ResponsiveBar } from '@nivo/bar';
import { useLoaderData, useNavigation } from 'react-router-dom';

import { formatValueAsPercentage } from '@/util';

import { ResponsiveCard } from '../ResponsiveCard';
import { CustomLabelLayer } from './CustomLabelLayer';
import { DolmaResponse } from './DolmaTabs';
import { ChartContainerSansLegend } from './sharedCharting';

export interface BarData {
    id: string;
    label: string;
    value: number;
    color: string;
}

// format label of bar data to display with comma
const numberFormat = new Intl.NumberFormat();
export const formatNumberWithCommas = (value: number) => {
    return numberFormat.format(value);
};

export const SourcesBarChart = () => {
    const sourcesData = (useLoaderData() as DolmaResponse).barData;
    const navigation = useNavigation();
    const theme = useTheme();

    const isLoading = navigation.state === 'loading';

    // Calculate the total sum of all data values
    const totalSum = sourcesData.reduce((acc, item) => acc + item.value, 0);

    const filteredData: BarData[] = [];
    const sourcesLessThanOnePercent: BarData[] = [];

    let totalSumOfSourcesLessThanOnePercent: number = 0;

    sourcesData.forEach((data) => {
        const percentageValue = (data.value / totalSum) * 100;
        if (percentageValue > 1) {
            filteredData.push(data);
        } else {
            totalSumOfSourcesLessThanOnePercent += data.value;
            sourcesLessThanOnePercent.push(data);
        }
    });

    if (totalSumOfSourcesLessThanOnePercent > 0) {
        filteredData.push({
            id: 'other',
            label: 'Other*',
            value: totalSumOfSourcesLessThanOnePercent,
            color: theme.palette.primary.main,
        });
    }

    // sort from lowest to highest so Nivo can display from highest to lowest
    const sortedData = filteredData.sort((a, b) => a.value - b.value);

    const generatedBarAriaLabel = (data: ComputedDatum<BarData>): string => {
        return `${data.data.label} makes up ${formatValueAsPercentage(data.data.value, totalSum)}% of the dataset and contains ${data.data.value} documents`;
    };

    if (isLoading) {
        return <LinearProgress />;
    }

    return (
        <ResponsiveCard>
            <Typography variant="h3" sx={{ marginBottom: (theme) => theme.spacing(-4) }}>
                Sources
            </Typography>
            <ChartContainerSansLegend>
                <ResponsiveBar
                    data={sortedData.map((item) => ({ ...item }))}
                    keys={['value']}
                    indexBy="label"
                    layout="horizontal"
                    labelSkipWidth={0}
                    labelSkipHeight={0}
                    padding={0.1}
                    colors={theme.palette.primary.main}
                    margin={{ top: 50, right: 30, bottom: 100, left: 110 }}
                    groupMode="grouped"
                    axisLeft={{
                        tickSize: 0,
                        tickPadding: 25,
                        tickRotation: 0,
                        legendPosition: 'middle',
                        legendOffset: -70,
                        format: (value) => value,
                    }}
                    axisBottom={{
                        tickSize: 0,
                        tickPadding: 20,
                        tickRotation: 0,
                        legend: 'Percentage of Dataset',
                        legendPosition: 'middle',
                        legendOffset: 80,
                        truncateTickAt: 0,
                        format: (value) => formatValueAsPercentage(value as number, totalSum),
                    }}
                    enableGridX={true}
                    enableGridY={false}
                    enableLabel={false}
                    minValue={0}
                    maxValue="auto"
                    layers={[
                        'grid',
                        'axes',
                        'bars',
                        'markers',
                        'legends',
                        'annotations',
                        CustomLabelLayer,
                    ]}
                    barAriaLabel={generatedBarAriaLabel}
                    isFocusable={true}
                />
            </ChartContainerSansLegend>
            <Divider />
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ border: 'none' }}>
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 'bold', textAlign: 'left' }}>
                                    Other* includes
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ border: 'none', textAlign: 'right', paddingRight: 2 }}>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        textAlign: 'right',
                                        margin: '20px 0 0',
                                    }}>
                                    Document Count
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sourcesLessThanOnePercent.map((data, index) => (
                            <TableRow key={index}>
                                <TableCell
                                    sx={{ textAlign: 'left', border: 'none', paddingLeft: 2 }}>
                                    <Typography variant="body1">{data.label}</Typography>
                                </TableCell>
                                <TableCell
                                    sx={{ textAlign: 'right', border: 'none', paddingRight: 2 }}>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: (theme) => theme.palette.primary.main,
                                        }}>
                                        {formatNumberWithCommas(data.value)}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </ResponsiveCard>
    );
};
