import Masonry from '@mui/lab/Masonry';
import { ReactNode } from 'react';

import { ImagePoints } from '../points/pointsDataTypes';
import {
    MAX_THREAD_IMAGE_HEIGHT_PX,
    MAX_THREAD_IMAGE_WIDTH_PX,
} from '../ThreadDisplay/threadDisplayConsts';
import { PointPicture, PointsSets } from './PointPicture';

interface PointPictureListProps {
    imagePointsSets?: ImagePoints[];
    fileUrls: readonly string[];
    showPerImageCaption?: boolean;
    onClick?: (image: { url: string; index: number }) => void;
}

export const PointPictureList = ({
    imagePointsSets = [],
    fileUrls,
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
        <Masonry columns={fileUrls.length < 3 ? fileUrls.length : 3} spacing={1}>
            {fileUrls.map((url, index) => {
                const pointsSets = pointsSetsByFileUrl.get(url) || [];
                return (
                    <PointPicture
                        key={url}
                        sx={{
                            height: 'fit-content',
                            width: 'fit-content',
                            maxHeight: MAX_THREAD_IMAGE_HEIGHT_PX,
                            maxWidth: MAX_THREAD_IMAGE_WIDTH_PX,
                        }}
                        onClick={
                            onClick
                                ? () => {
                                      onClick({ url, index });
                                  }
                                : undefined
                        }
                        imageLink={url}
                        pointsSets={pointsSets}
                    />
                );
            })}
        </Masonry>
    );
};
