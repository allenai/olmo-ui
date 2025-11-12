import { interpolate, useCurrentFrame } from 'remotion';

import { PerFrameTrackPoints } from '@/components/thread/points/pointsDataTypes';

import { FPS } from '../molmo-video';
import { SVGPoint } from './point';

export const VideoCountObjectComponent = ({ object }: { object: PerFrameTrackPoints }) => {
    return (
        <div>
            <FramePointComponent framePoint={object} />
        </div>
    );
};

const preTimestampOffset = 0.15;

const postTimestampOffset = 0.15;

export const FramePointComponent = ({ framePoint }: { framePoint: PerFrameTrackPoints }) => {
    const frame = useCurrentFrame();

    const pointShowStart = (framePoint.timestamp - preTimestampOffset) * FPS;
    const pointShowEnd = (framePoint.timestamp + postTimestampOffset) * FPS;

    if (frame < pointShowStart || frame > pointShowEnd) {
        return null;
    }

    const circleRadius = interpolate(
        frame,
        [pointShowStart, framePoint.timestamp * FPS, pointShowEnd],
        [0.5, 1, 0]
    );

    return (
        <>
            {framePoint.tracks.map((point, i) => (
                <SVGPoint key={i} point={point} circleRadius={circleRadius * 10} />
            ))}
        </>
    );
};
