import { ReactNode, useEffect, useState } from 'react';

import { MolmoTrackingVideo } from '@/components/video/tracking/MolmoTrackingVideo';

import { MediaCollapsibleWidget } from '../PointResponseMessage/CollapsibleMediaWidget';
import { PointPictureList } from '../PointResponseMessage/PointPictureList';

type FileType = 'file' | 'image' | 'video';

interface UserMessageFileWidgetProps {
    fileUrls: string[];
}

export const UserMessageFileWidget = ({ fileUrls }: UserMessageFileWidgetProps): ReactNode => {
    const [fileType, setFileType] = useState<FileType | null>(null);
    const isPending = fileType === null;

    useEffect(() => {
        const determineFileType = async (url: string) => {
            try {
                const response = await fetch(url, { method: 'GET' }); // TODO: change to HEAD when CORS allows this on the bucket
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const headers = response.headers;
                const contentType = headers.get('Content-Type');

                if (contentType?.startsWith('image/')) {
                    setFileType('image');
                } else if (contentType?.startsWith('video/')) {
                    setFileType('video');
                } else {
                    setFileType('file');
                }
            } catch (error) {
                console.error('Error fetching fileUrl headers:', error);
                setFileType('file');
            }
        };

        void determineFileType(fileUrls[0]);
    }, [fileUrls]);

    if (isPending || fileUrls.length === 0) return null;

    if (fileType === 'image') {
        return (
            <MediaCollapsibleWidget fileType={fileType} fileCount={fileUrls.length} defaultExpanded>
                <PointPictureList fileUrls={fileUrls} />
            </MediaCollapsibleWidget>
        );
    }
    if (fileType === 'video') {
        return (
            <MediaCollapsibleWidget fileType={fileType} fileCount={fileUrls.length} defaultExpanded>
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
