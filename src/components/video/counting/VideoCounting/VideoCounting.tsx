import { memo, type ReactNode } from 'react';

import type { VideoFramePoints } from '@/components/thread/points/pointsDataTypes';
import { VideoOverlayHelper } from '@/components/video/VideoOverlayHelper';

import { VideoCountingPointsContainer } from './VideoCountingPointsContainer';

interface VideoCountingProps {
    videoUrl: string;
    videoPoints: VideoFramePoints;
}

export const VideoCounting = memo(function VideoCounting({
    videoPoints,
    videoUrl,
}: VideoCountingProps): ReactNode {
    return (
        <VideoOverlayHelper videoUrl={videoUrl}>
            <VideoCountingPointsContainer videoPoints={videoPoints} />
        </VideoOverlayHelper>
    );
});
