import { Box } from '@mui/material';
import { ReactNode } from 'react';

import { ImagePoints } from '../points/pointsDataTypes';
import { MAX_THREAD_IMAGE_HEIGHT_PX } from '../ThreadDisplay/threadDisplayConsts';
import { PointPicture, PointsSets } from './PointPicture';
import { PointPictureCaption } from './PointPictureCaption';

interface PointPictureListProps {
    imagePointsSets: ImagePoints[];
    fileUrls: readonly string[];
    showPerImageCaption?: boolean;
    onClick?: () => void;
}

export const PointPictureList = ({
    imagePointsSets,
    fileUrls,
    showPerImageCaption,
    onClick,
}: PointPictureListProps): ReactNode => {
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

    return (
        <Box
            component="ul"
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, auto)',
                gap: 1,
                // justifyContent: 'center',
                // alignItems: 'center',
            }}>
            {fileUrls.map((url) => {
                const pointsSets = pointsSetsByFileUrl.get(url) || [];
                return (
                    <Box
                        component="li"
                        key={url}
                        sx={{
                            maxHeight: MAX_THREAD_IMAGE_HEIGHT_PX,
                            maxWidth: MAX_THREAD_IMAGE_HEIGHT_PX,
                        }}>
                        <PointPicture
                            sx={{
                                height: 'fit-content',
                                width: 'fitContent',
                                paddingBottom: showPerImageCaption ? '2.5em' : 0,
                            }}
                            onClick={onClick}
                            imageLink={url}
                            pointsSets={pointsSets}
                            caption={
                                showPerImageCaption && (
                                    <PointPictureCaption pointsSets={pointsSets} />
                                )
                            }
                        />
                    </Box>
                );
            })}
        </Box>
    );
};
