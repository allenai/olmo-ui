import mime from 'mime/lite';
import { ReactNode } from 'react';

import { MolmoTrackingVideo } from '@/components/video/tracking/MolmoTrackingVideo';

import { MediaCollapsibleWidget } from '../PointResponseMessage/CollapsibleMediaWidget';
import { PointPictureList } from '../PointResponseMessage/PointPictureList';

interface UserMessageFileWidgetProps {
    fileUrls: string[];
}

export const UserMessageFileWidget = ({ fileUrls }: UserMessageFileWidgetProps): ReactNode => {
    const mimeType = mime.getType(fileUrls[0]);

    if (fileUrls.length === 0) return null;

    if (mimeType?.startsWith('image/')) {
        return (
            <MediaCollapsibleWidget fileType="image" fileCount={fileUrls.length} defaultExpanded>
                <PointPictureList fileUrls={fileUrls} />
            </MediaCollapsibleWidget>
        );
    }
    if (mimeType?.startsWith('video/')) {
        return (
            <MediaCollapsibleWidget fileType="video" fileCount={fileUrls.length} defaultExpanded>
                <MolmoTrackingVideo
                    videoUrl={fileUrls[0]}
                    videoTrackingPoints={{ label: '', type: 'track-points', frameList: [] }}
                    suppressInterpolation
                />
            </MediaCollapsibleWidget>
        );
    }

    return null;
};
