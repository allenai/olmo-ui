import { css } from '@allenai/varnish-panda-runtime/css';
import { Box, BoxProps, styled } from '@mui/material';
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

interface PointPictureProps extends BoxProps {
    imageLink: string;
    imageAlt?: string;
    pointsSets: PointsSets[];
    caption?: React.ReactNode;
    onClick?: () => void;
}

export const PointPicture = ({
    imageLink,
    imageAlt,
    pointsSets,
    caption,
    onClick,
    ...boxProps
}: PointPictureProps): ReactNode => {
    const pointColors = usePointColors();

    return (
        <Box {...boxProps}>
            <Box
                component={onClick ? 'button' : 'figure'}
                onClick={onClick}
                sx={{
                    position: 'relative',
                    display: 'grid',
                    gridTemplateRows: '100%',
                    gridTemplateColumns: '100%',
                    gridTemplateAreas: '"combined"',
                    justifyItems: 'center',
                    height: 'inherit',
                    width: 'auto',
                    maxWidth: '100%',
                    '&:hover': {
                        cursor: onClick ? 'pointer' : undefined,
                    },
                }}>
                <Box
                    component="img"
                    src={imageLink}
                    alt={imageAlt}
                    sx={{
                        height: 'inherit',
                        width: 'inherit',
                        gridArea: 'combined',
                        objectFit: 'contain',
                    }}
                />
                {pointsSets.map((pointSet, index) => {
                    return (
                        <div
                            key={`${pointSet.url}-${index}`}
                            className={css({
                                position: 'absolute',
                                width: '[100%]',
                                height: '[100%]',
                            })}>
                            <PointOnImage
                                points={pointSet.points}
                                fill={pointColors[index % pointColors.length]}
                            />
                        </div>
                    );
                })}
            </Box>
            {caption}
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
    <PointOnImageSvg
        aria-hidden
        width="0"
        height="0"
        sx={{
            color: fill,
        }}>
        {points.map((point) => (
            <PointCircle key={point.pointId} cx={point.x} cy={point.y} />
        ))}
    </PointOnImageSvg>
);

// This is using styled because Box eats the height and width properties that we want to pass to the SVG!
const PointOnImageSvg = styled('svg')({
    gridArea: 'combined',
    height: '100%',
    width: '100%',
});
