import type { ReactNode } from 'react';

import { PointPicture, type PointPictureProps } from '../PointPicture';

interface PointPictureModalProps {
    pictures: Pick<PointPictureProps, 'imageLink' | 'pointInfos'>[];
    caption?: string;
}

export const PointPictureModal = ({ pictures }: PointPictureModalProps): ReactNode => {
    return (
        <div data-test-id="point-picture-carousel">
            {pictures.map((picture) => (
                <PointPicture key={picture.imageLink} {...picture} />
            ))}
        </div>
    );
};
