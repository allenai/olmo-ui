import { css } from '@allenai/varnish-panda-runtime/css';
import { memo, type ReactNode } from 'react';

import type { VideoFramePoints } from '@/components/thread/points/pointsDataTypes';

import { VideoFramePointsOverlay } from './VideoFramePointsOverlay';

interface VideoCountingPointsContainerProps {
    videoPoints: VideoFramePoints;
}

export const VideoCountingPointsContainer = memo(function VideoCountingPointsContainer({
    videoPoints,
}: VideoCountingPointsContainerProps): ReactNode {
    return (
        <div className={css({ position: 'relative' })}>
            {videoPoints.frameList.map(({ timestamp, points }) => (
                <VideoFramePointsOverlay key={timestamp} timestamp={timestamp} points={points} />
            ))}
        </div>
    );
});
