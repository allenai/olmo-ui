import { useEffect, useState } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { useMediaQuery, useTheme as useMuiTheme } from '@mui/material';

import { ChartContainerSansLegend, legendItemHeight } from './sharedCharting';
import { staticData } from '../../api/dolma/staticData';

export interface PieData {
    id: string;
    label: string;
    value: number;
    color: string;
}

interface Props {
    data: PieData[];
    sourceMap: staticData.Sources;
}

export const SourcesPieChart = ({ data, sourceMap }: Props) => {
    const theme = useMuiTheme();
    const greaterThanSm = useMediaQuery(theme.breakpoints.up('sm'));
    const [hiddenSources, setHiddenSources] = useState<string[]>([]);
    const [orderedData, setOrderedData] = useState<PieData[]>([]);

    useEffect(() => {
        setOrderedData(
            data
                .filter((v) => !hiddenSources.includes(v.id))
                .sort((a, b) => sourceMap[b.id].order - sourceMap[a.id].order)
        );
    }, [hiddenSources]);

    const sourceCount = Object.keys(sourceMap).length;

    return (
        <ChartContainerSansLegend>
            <ResponsivePie
                data={orderedData}
                colors={{ datum: 'data.color' }}
                valueFormat={(value) => `${Number(value).toLocaleString()} documents`}
                margin={{
                    top: 40,
                    right: greaterThanSm ? 160 : 20,
                    bottom: greaterThanSm ? 40 : 40 + legendItemHeight * sourceCount,
                    left: 40,
                }}
                startAngle={-82}
                innerRadius={0.66}
                padAngle={2}
                cornerRadius={4}
                activeOuterRadiusOffset={12}
                borderWidth={3}
                borderColor={{
                    from: 'color',
                    modifiers: [['darker', 0.1]],
                }}
                enableArcLabels={false}
                arcLinkLabelsDiagonalLength={16}
                arcLinkLabelsTextColor={{
                    from: 'color',
                    modifiers: [['darker', 1.4]],
                }}
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
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
                        anchor: greaterThanSm ? 'bottom-right' : 'bottom-left',
                        direction: 'column',
                        justify: false,
                        translateX: greaterThanSm ? 140 : 0,
                        translateY: greaterThanSm ? 0 : 35 + legendItemHeight * sourceCount,
                        itemsSpacing: 0,
                        itemDirection: 'left-to-right',
                        itemWidth: 130,
                        itemHeight: legendItemHeight,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: 'square',
                    },
                ]}
            />
        </ChartContainerSansLegend>
    );
};
