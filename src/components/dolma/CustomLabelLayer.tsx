import { useTheme } from '@mui/material';
import { BarCustomLayerProps } from '@nivo/bar';

import { BarData, formatNumberWithCommas } from './SourcesBarChart';

const BarWithThresHold = 100;

export const CustomLabelLayer = ({ bars }: BarCustomLayerProps<BarData>) => {
    const theme = useTheme();

    return (
        <>
            {bars.map((bar) => {
                const isLongBar = bar.width > BarWithThresHold;
                const labelX = isLongBar ? bar.x + bar.width / 2 : bar.x + bar.width + 5;
                const textColor = isLongBar
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.primary;

                return (
                    <text
                        key={bar.key}
                        x={labelX}
                        y={bar.y + bar.height / 2 + 4}
                        textAnchor={isLongBar ? 'middle' : 'start'}
                        style={{
                            fill: textColor,
                            fontSize: 14,
                        }}>
                        {`${formatNumberWithCommas(bar.data.data.value)} Documents`}
                    </text>
                );
            })}
        </>
    );
};
