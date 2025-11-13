import { useCurrentFrame, useVideoConfig } from 'remotion';

import { PerFrameTrackPoints } from '@/components/thread/points/pointsDataTypes';

import { SVGPoint } from './point';
export const VideoCountObjectBlinkComponent = ({ object }: { object: PerFrameTrackPoints }) => {
    return (
        <div>
            <FramePointBlinkComponent framePoint={object} />
        </div>
    );
};

export const FramePointBlinkComponent = ({ framePoint }: { framePoint: PerFrameTrackPoints }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const pointShowStart = (framePoint.timestamp - 0.05) * fps;
    const pointShowEnd = (framePoint.timestamp + 0.05) * fps;

    if (frame < pointShowStart || frame > pointShowEnd) {
        return null;
    }

    return (
        <>
            {framePoint.tracks.map((point, i) => (
                <SVGPoint key={i} point={point} circleRadius={10} />
            ))}
        </>
    );
};
