import { Box, styled } from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import { ReactNode } from 'react';

import { Point, PointInfo } from '../points/molmo1/extractPointData';
import { PointCircle } from './PointCircle';
import { usePointColors } from './usePointColors';

export interface PointPictureProps {
    imageLink: string;
    pointInfos: PointInfo[];
    caption?: React.ReactNode;
    sx?: SxProps<Theme>;
}

export const PointPicture = ({
    imageLink,
    pointInfos,
    caption,
    sx,
}: PointPictureProps): ReactNode => {
    const pointColors = usePointColors();
    return (
        <>
            <Box component="img" src={imageLink} alt="" sx={sx} />
            {pointInfos.map((pointInfo, i) => {
                return (
                    <PointOnImage
                        key={i}
                        points={pointInfo.points}
                        fill={pointColors[i % pointColors.length]}
                    />
                );
            })}
            {caption}
        </>
    );
};

interface PointOnImageProps {
    points: Point[];
    fill: string;
}
const PointOnImage = ({ points, fill }: PointOnImageProps): ReactNode => (
    // Height and width are applied here to give it a minimum viewport of 0w,0h. Otherwise it gets set to the default of 300wx150h
    // This allows us to scale down to smaller sizes
    <PointOnImageSvg aria-hidden width="0" height="0" sx={{ color: fill }}>
        {points.map((point, pointIndex) => (
            <PointCircle xPercent={point.x} yPercent={point.y} key={pointIndex} shouldAnimate />
        ))}
    </PointOnImageSvg>
);

// This is using styled because Box eats the height and width properties that we want to pass to the SVG!
const PointOnImageSvg = styled('svg')({
    gridArea: 'combined',
    height: '100%',
    width: '100%',
    zIndex: 1,
});
