import { styled, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { ReactNode } from 'react';

import { PointCircle } from './PointCircle';
import { PointsSets } from './PointPicture';
import { usePointColors } from './usePointColors';

export const PointPictureCaption = ({ pointsSets }: { pointsSets: PointsSets[] }): ReactNode => {
    const pointColors = usePointColors();
    return (
        <Stack gap={1} useFlexGap component="figcaption" sx={{ marginBlockStart: 1 }}>
            {pointsSets.map((set, index) => (
                <PointLabel
                    key={index}
                    text={set.alt || set.label}
                    pointColor={pointColors[index % pointColors.length]}
                    count={set.points.length}
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
    count: number;
}
const PointLabel = ({ pointColor, text, count }: PointLabelProps): ReactNode => (
    <Stack gap="0.5ch" useFlexGap direction="row" alignItems="center">
        <PointLabelSvg
            viewBox="0 0 20 20"
            height="1em"
            width="1em"
            aria-hidden
            sx={{ color: pointColor }}>
            <PointCircle xPercent={50} yPercent={50} />
        </PointLabelSvg>
        <Typography>
            {text} ({count})
        </Typography>
    </Stack>
);
