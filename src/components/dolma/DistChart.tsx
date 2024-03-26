import { useState, useEffect } from 'react';
import { Typography, useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import { TableTooltip, Chip } from '@nivo/tooltip';
import { useTheme } from '@nivo/core';

import {
    ChartContainer,
    chartTheme,
    legendItemHeight,
    percentValueFormat,
    DistData,
    MapDistData,
} from './sharedCharting';
import { staticData } from '../../api/dolma/staticData';

interface Props {
    data: DistData[];
    mapData: MapDistData;
    sourceMap: staticData.Sources;
    categoryLabel: string;
}

export const DistChart = ({ data, mapData, sourceMap, categoryLabel }: Props) => {
    const theme = useMuiTheme();
    const greaterThanSm = useMediaQuery(theme.breakpoints.up('sm'));
    const [hiddenSources, setHiddenSources] = useState<string[]>([]);
    const [orderedSources, setOrderedSources] = useState<[string, staticData.Source][]>([]);

    useEffect(() => {
        setOrderedSources(
            Object.entries(sourceMap)
                .filter(([k, _v]) => !hiddenSources.includes(k))
                .sort(([_ak, av], [_bk, bv]) => bv.order - av.order)
        );
    }, [hiddenSources]);

    const buckets = Object.values(data).map((d) => d.bucket);
    const labelsMore = Array.from(buckets).map((v, i) => (i % 9 === 0 ? v : ' '.repeat(i)));
    const labelsLess = Array.from(buckets).map((v, i) => (i % 16 === 0 ? v : ' '.repeat(i)));

    const sourceCount = Object.keys(sourceMap).length;
    return (
        <ChartContainer
            $legendHeight={sourceCount * legendItemHeight}
            $legendOnRight={greaterThanSm}>
            <ResponsiveBar
                theme={chartTheme}
                keys={orderedSources.map(([k, _v]) => k)}
                colors={orderedSources.map(([_k, v]) => v.color)}
                valueFormat={percentValueFormat}
                data={data}
                indexBy="bucket"
                enableLabel={false}
                groupMode="stacked"
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                margin={{
                    top: 20,
                    right: greaterThanSm ? 160 : 20,
                    bottom: greaterThanSm ? 60 : 80 + legendItemHeight * sourceCount,
                    left: 40,
                }}
                axisBottom={{
                    tickValues: greaterThanSm ? labelsMore : labelsLess,
                    tickSize: 5,
                    tickPadding: 5,
                    legend: categoryLabel,
                    legendOffset: 45,
                    legendPosition: 'middle',
                }}
                axisLeft={{
                    format: () => '',
                    tickSize: 0,
                    legend: '% of Documents',
                    legendOffset: -20,
                    legendPosition: 'middle',
                }}
                legends={[
                    {
                        data: Object.entries(sourceMap)
                            .sort(([_ak, av], [_bk, bv]) => av.order - bv.order)
                            .map(([sk, sv]) => {
                                return {
                                    id: sk,
                                    label: sv.label,
                                    color: sv.color,
                                    hidden: hiddenSources.includes(sk.toString()),
                                };
                            }),
                        onClick: (v) => {
                            if (!hiddenSources.includes(v.id.toString())) {
                                setHiddenSources([...hiddenSources, v.id.toString()]);
                            } else {
                                setHiddenSources(
                                    hiddenSources.filter((s) => s !== v.id.toString())
                                );
                            }
                        },
                        dataFrom: 'keys',
                        anchor: greaterThanSm ? 'bottom-right' : 'bottom-left',
                        direction: 'column',
                        justify: false,
                        translateX: greaterThanSm ? 140 : 0,
                        translateY: greaterThanSm ? 0 : 75 + legendItemHeight * sourceCount,
                        itemsSpacing: 0,
                        itemDirection: 'left-to-right',
                        itemWidth: 130,
                        itemHeight: legendItemHeight,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: 'square',
                    },
                ]}
                tooltip={({ id, value, color, data }) => {
                    const theme = useTheme();
                    return (
                        <TableTooltip
                            title={
                                <div>
                                    {categoryLabel}: {data.bucket}
                                </div>
                            }
                            rows={[
                                [
                                    <Chip key="chip" color={color} style={theme.tooltip.chip} />,
                                    <Typography key="label" sx={{ textAlign: 'left' }}>
                                        {sourceMap[id.toString()].label}
                                    </Typography>,
                                    <Typography key="docCount" sx={{ textAlign: 'right' }}>
                                        <span key="value" style={theme.tooltip.tableCellValue}>
                                            {mapData[data.bucket][
                                                id.toString()
                                            ].doc_count.toLocaleString()}
                                            docs
                                        </span>
                                    </Typography>,
                                    <Typography key="value2Container" sx={{ textAlign: 'left' }}>
                                        <span key="value2" style={theme.tooltip.tableCellValue}>
                                            {percentValueFormat(value)}
                                        </span>
                                    </Typography>,
                                ],
                            ]}
                        />
                    );
                }}
            />
        </ChartContainer>
    );
};
