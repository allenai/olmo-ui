import { styled, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { ReactNode } from 'react';

import { PointInfo } from '../points/molmo1/extractPointData';
import { PointCircle } from './PointCircle';
import { usePointColors } from './usePointColors';

export const PointPictureCaption = ({ pointInfos }: { pointInfos: PointInfo[] }): ReactNode => {
    const pointColors = usePointColors();
    return (
        <Stack gap={1} useFlexGap component="figcaption" sx={{ marginBlockStart: 1 }}>
            {pointInfos.map((pointInfo, i) => (
                <PointLabel
                    key={i}
                    text={pointInfo.alt}
                    pointColor={pointColors[i % pointColors.length]}
                />
            ))}
        </Stack>
    );
};

// This lets us use sx without using a box
const PointLabelSvg = styled('svg')({});

interface PointLabelProps {
    pointColor: string;
    text: string;
}
const PointLabel = ({ pointColor, text }: PointLabelProps): ReactNode => (
    <Stack gap="0.5ch" useFlexGap direction="row" alignItems="center">
        <PointLabelSvg
            viewBox="0 0 20 20"
            height="1em"
            width="1em"
            aria-hidden
            sx={{ color: pointColor }}>
            <PointCircle xPercent={50} yPercent={50} />
        </PointLabelSvg>
        <Typography>{text}</Typography>
    </Stack>
);
