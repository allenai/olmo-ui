import { color2 } from '@allenai/varnish2/theme';
import { DatumValue, TextStyle, Theme } from '@nivo/core';
import styled from 'styled-components';

import { staticData } from '../../api/dolma/staticData';

export interface DistData {
    [index: string]: number | string;
}

export interface MapDistData {
    [bucket: string]: {
        [source: string]: staticData.BinnedData;
    };
}

export const ChartContainerSansLegend = styled.div`
    height: 400px;
`;

export const ChartContainer = styled.div<{ $legendHeight: number; $legendOnRight: boolean }>`
    height: ${({ $legendHeight, $legendOnRight }) =>
        $legendOnRight ? '400px' : `${400 + $legendHeight}px`};
`;

export const legendItemHeight = 20;

const textStyle = {
    fontSize: 16,
    fill: color2.N5.hex,
};

export const chartTheme: Theme = {
    axis: {
        legend: {
            text: { ...textStyle, fontWeight: 'bold' },
        },
        ticks: {
            text: textStyle,
        },
    },
    legends: {
        hidden: {
            text: { ...textStyle, textDecoration: 'line-through' } as TextStyle,
        },
        title: {
            text: textStyle,
        },
        text: textStyle,
        ticks: {
            text: textStyle,
        },
    },
};

export const percentValueFormat = (v: number | DatumValue) => {
    return Number(v).toLocaleString(undefined, {
        style: 'percent',
        maximumSignificantDigits: 2,
    });
};

// build out data in the form needed for a bar chart
export const getDistAndMapDistData = (
    data: staticData.BinnedBySource,
    format: (b: number) => string
) => {
    const chartData: { [bucket: string]: DistData } = {};
    const mapData: MapDistData = {};
    Object.entries(data).forEach(([k, v]) => {
        v.forEach((d) => {
            const key = d.min === d.max ? format(d.min) : `${format(d.min)}-${format(d.max)}`;
            if (!chartData[key]) {
                chartData[key] = { bucket: key, order: d.min };
            }
            if (!mapData[key]) {
                mapData[key] = {};
            }
            chartData[key][k] = d.percentage;
            mapData[key][k] = d;
        });
    });

    // sort by order and remove order from object
    return [
        Object.values(chartData)
            .sort((av, bv) => Number(av.order) - Number(bv.order))
            .map((v) => {
                delete v.order;
                return v;
            }),
        mapData,
    ] as const;
};
