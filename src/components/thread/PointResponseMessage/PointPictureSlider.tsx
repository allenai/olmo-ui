import { Box } from '@mui/material';
import { ReactNode } from 'react';

import { ImagePoints } from '../points/pointsDataTypes';
import {
    MAX_THREAD_IMAGE_HEIGHT_PX,
    MIN_THREAD_IMAGE_HEIGHT_PX,
} from '../ThreadDisplay/threadDisplayConsts';
import { PointPicture, PointsSets } from './PointPicture';
import { PointPictureCaption } from './PointPictureCaption';

interface PointPictureSliderProps {
    imagePointsSets: ImagePoints[];
    fileUrls: readonly string[];
    showPerImageCaption?: boolean;
    onClick?: (image: { url: string; index: number }) => void;
}

export const PointPictureSlider = ({
    imagePointsSets,
    fileUrls,
    showPerImageCaption,
    onClick,
}: PointPictureSliderProps): ReactNode => {
    const pointsSetsByFileUrl = fileUrls.reduce<Map<string, PointsSets[]>>((acc, url, index) => {
        imagePointsSets.forEach(({ label, alt, imageList }) => {
            const pointsPerImageId = imageList.find(
                ({ imageId }) => imageId === `${index + 1}`
            )?.points;

            const prev = acc.get(url) || [];

            if (pointsPerImageId) {
                acc.set(url, [
                    ...prev,
                    {
                        label,
                        alt,
                        url,
                        points: pointsPerImageId,
                    },
                ]);
            }
        });

        return acc;
    }, new Map());

    const isSingleImageList = fileUrls.length === 1;

    return (
        <Box
            component="ul"
            sx={{
                display: 'grid',
                gridAutoFlow: 'column',
                gridAutoColumns: 'auto',
                gridTemplateRows: `minmax(${MIN_THREAD_IMAGE_HEIGHT_PX}px, ${MAX_THREAD_IMAGE_HEIGHT_PX}px)`,
                gap: 1.5,

                backgroundColor: 'inherit',
                height: isSingleImageList ? 'auto' : '100%',
                maxHeight: MAX_THREAD_IMAGE_HEIGHT_PX,
                overflowX: !isSingleImageList ? 'auto' : undefined,
                position: 'relative',

                anchorName: '--slider',
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth',
                scrollMarkerGroup: 'after',
            }}>
            {fileUrls.map((url, index) => {
                const pointsSets = pointsSetsByFileUrl.get(url) || [];
                return (
                    <PointPicture
                        sx={
                            !isSingleImageList
                                ? {
                                      height: '100%',
                                      width: 'max-content',
                                      paddingBottom: showPerImageCaption ? '2.5em' : 0,
                                      scrollSnapAlign: 'center',
                                  }
                                : undefined
                        }
                        key={url}
                        onClick={() => {
                            return onClick?.({ url, index });
                        }}
                        imageLink={url}
                        pointsSets={pointsSets}
                        caption={
                            showPerImageCaption && <PointPictureCaption pointsSets={pointsSets} />
                        }
                    />
                );
            })}
        </Box>
    );
};
