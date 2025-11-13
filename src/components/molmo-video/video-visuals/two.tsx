import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { PerFrameTrackPoints } from '@/components/thread/points/pointsDataTypes';

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
    const { fps } = useVideoConfig();

    const pointShowStart = (framePoint.timestamp - preTimestampOffset) * fps;
    const pointShowEnd = (framePoint.timestamp + postTimestampOffset) * fps;
    if (frame < pointShowStart || frame > pointShowEnd) {
        return null;
    }

    const circleRadius = interpolate(
        frame,
        [pointShowStart, framePoint.timestamp * fps, pointShowEnd],
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
