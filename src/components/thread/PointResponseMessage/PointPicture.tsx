import { Box, styled } from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import { ReactNode } from 'react';

import { Point } from '../points/pointsDataTypes';
import { PointCircle } from './PointCircle';
import { usePointColors } from './usePointColors';

export interface PointsSets {
    label: string;
    alt?: string;
    url: string;
    points: Point[];
}

interface PointPictureProps {
    imageLink: string;
    pointsSets: PointsSets[];
    caption?: React.ReactNode;
    sx?: SxProps<Theme>;
    onClick?: () => void;
}

export const PointPicture = ({
    imageLink,
    pointsSets,
    caption,
    sx,
    onClick,
}: PointPictureProps): ReactNode => {
    const pointColors = usePointColors();
    return (
        <Box component="li" sx={sx}>
            <Box
                onClick={onClick}
                component="figure"
                sx={{
                    display: 'grid',
                    gridTemplateRows: '100%',
                    gridTemplateAreas: '"combined"',
                    height: 'inherit',
                    width: 'fit-content',
                    maxWidth: '100%',
                    '&:hover': {
                        cursor: onClick ? 'pointer' : undefined,
                    },
                }}>
                <Box
                    component="img"
                    src={imageLink}
                    alt=""
                    sx={{ height: 'inherit', gridArea: 'combined', objectFit: 'contain' }}
                />
                {pointsSets.map((pointSet, index) => {
                    return (
                        <PointOnImage
                            key={`${pointSet.url}-${index}`}
                            points={pointSet.points}
                            fill={pointColors[index % pointColors.length]}
                        />
                    );
                })}
                {caption}
            </Box>
        </Box>
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
        {points.map((point) => (
            <PointCircle key={point.pointId} xPercent={point.x} yPercent={point.y} shouldAnimate />
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
