import {
    Box,
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
import { AxisTickProps } from '@nivo/axes'; // Import correct types
import { BarDatum, BarTooltipProps, ComputedDatum, ResponsiveBar } from '@nivo/bar';
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
        return `${data.data.label} makes up ${formatValueAsPercentage(data.data.value, totalSum)} of the dataset and contains ${data.data.value} documents`;
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
                    colors={theme.palette.background.reversed}
                    margin={{ top: 50, right: 30, bottom: 100, left: 110 }}
                    groupMode="grouped"
                    axisLeft={{
                        tickSize: 0,
                        tickPadding: 25,
                        tickRotation: 0,
                        legendPosition: 'middle',
                        legendOffset: -70,
                        format: (value) => value,
                        renderTick: (props: AxisTickProps<string | number>) => {
                            const { x, y, value } = props;
                            return (
                                <g transform={`translate(${x + 5}, ${y})`}>
                                    <text
                                        dominantBaseline="central"
                                        textAnchor="end"
                                        transform="translate(-25, 0)"
                                        style={{
                                            fontSize: '11px',
                                            fill: theme.palette.primary.contrastText,
                                        }}>
                                        {value}
                                    </text>
                                </g>
                            );
                        },
                    }}
                    labelTextColor={theme.palette.primary.contrastText}
                    axisBottom={{
                        tickSize: 0,
                        tickPadding: 20,
                        tickRotation: 0,
                        legend: 'Percentage of Dataset',
                        legendPosition: 'middle',
                        legendOffset: 80,
                        truncateTickAt: 0,
                        renderTick: (props: AxisTickProps<string | number>) => {
                            const { x, y, value } = props;
                            return (
                                <g transform={`translate(${x - 15}, ${y + 35})`}>
                                    <text
                                        style={{
                                            fontSize: theme.typography.body2.fontSize,
                                            fontFamily: theme.typography.body2.fontFamily,
                                            fontWeight: theme.typography.body2.fontWeight,
                                            fill: theme.palette.primary.contrastText,
                                        }}>
                                        {formatValueAsPercentage(value as number, totalSum)}
                                    </text>
                                </g>
                            );
                        },
                    }}
                    tooltip={SourcesTooltip}
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
            <Divider
                sx={{
                    borderColor: (theme) =>
                        `color-mix(in srgb, ${theme.palette.background.reversed} 50%, transparent)`,
                }}
            />
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ border: 'none' }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: (theme) => theme.typography.fontWeightBold,
                                        textAlign: 'left',
                                        color: (theme) => theme.palette.text.primary,
                                    }}>
                                    Other* includes
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ border: 'none', textAlign: 'right', paddingRight: 2 }}>
                                <Typography
                                    variant="h6"
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
                                    <Typography
                                        variant="h6"
                                        sx={{ color: (theme) => theme.palette.text.secondary }}>
                                        {data.label}
                                    </Typography>
                                </TableCell>
                                <TableCell
                                    sx={{ textAlign: 'right', border: 'none', paddingRight: 2 }}>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: (theme) => theme.palette.text.primary,
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

export const SourcesTooltip = ({ value, color, label }: BarTooltipProps<BarDatum>) => {
    return (
        <Box
            sx={{
                background: (theme) => theme.palette.background.drawer.primary,
                color: 'text.primary',
                fontSize: 'inherit',
                borderRadius: '2px',
                boxShadow: 'rgba(0, 0, 0, 0.25) 0px 1px 2px',
                padding: '5px 9px',
            }}>
            <Box
                sx={{
                    whiteSpace: 'pre',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                <Box
                    sx={{
                        display: 'block',
                        width: '12px',
                        height: '12px',
                        marginRight: '7px',
                    }}
                    style={{
                        background: color,
                    }}
                />
                <Box>
                    value - {label}: <strong>{value}</strong>
                </Box>
            </Box>
        </Box>
    );
};
