import { css } from '@allenai/varnish-panda-runtime/css';
import mime from 'mime/lite';
import { ReactNode, useState } from 'react';

import type { SchemaMolmo2PointPart } from '@/api/playgroundApi/playgroundApiSchema';
import type { VideoTrackingPoints } from '@/components/thread/points/pointsDataTypes';
import { MolmoTrackingVideo } from '@/components/video/tracking/MolmoTrackingVideo';

import { MediaLightbox } from '../PointResponseMessage/MediaLightbox';
import { PointPictureSlider } from '../PointResponseMessage/PointPictureSlider';
import { FileThumbnails } from '../QueryForm/FileUploadThumbnails/FileThumbnailDisplay';

interface UserMessageFileWidgetProps {
    fileUrls: string[];
}

export const UserMessageFileWidget = ({ fileUrls }: UserMessageFileWidgetProps): ReactNode => {
    const mimeType = mime.getType(fileUrls[0]);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const isPending = mimeType === null;

    if (fileUrls.length === 0) return null;

    const handleThumbnailClick = (index: number) => {
        setLightboxIndex(index);
    };

    const handleLightboxClose = () => {
        setLightboxIndex(null);
    };

    if (isPending || fileUrls.length === 0) return null;

    if (mimeType.startsWith('image/')) {
        return (
            <div className={css({ paddingBottom: '2' })}>
                <FileThumbnails mediaType="image/" urls={fileUrls} onClick={handleThumbnailClick} />
                <MediaLightbox open={lightboxIndex !== null} onClose={handleLightboxClose}>
                    {lightboxIndex !== null && (
                        <PointPictureSlider fileUrls={fileUrls} moveToItem={lightboxIndex} />
                    )}
                </MediaLightbox>
            </div>
        );
    }
    if (mimeType === 'video') {
        const mapPointToData = (_userPoint: SchemaMolmo2PointPart | null) => {
            // TODO refactor seekbar to generic type
            const point: VideoTrackingPoints = {
                label: '1',
                type: 'track-points',
                frameList: [],
            };
            return point;
        };

        return (
            <div className={css({ paddingBottom: '3' })}>
                <FileThumbnails mediaType="video" urls={fileUrls} onClick={handleThumbnailClick} />
                <MediaLightbox open={lightboxIndex !== null} onClose={handleLightboxClose}>
                    {lightboxIndex !== null && (
                        <div
                            className={css({
                                backgroundColor: 'background',
                                position: 'relative',
                                maxWidth: '[80dvw]',
                                maxHeight: '[90dvw]',
                                width: '[1000px]',
                            })}>
                            <MolmoTrackingVideo
                                videoUrl={fileUrls[0]}
                                videoTrackingPoints={mapPointToData(null)}
                            />
                        </div>
                    )}
                </MediaLightbox>
            </div>
        );
    }

    return null;
};
