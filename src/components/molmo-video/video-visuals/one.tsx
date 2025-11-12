import { useCurrentFrame } from 'remotion';

import { PerFrameTrackPoints } from '@/components/thread/points/pointsDataTypes';

import { FPS } from '../molmo-video';
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

    const pointShowStart = (framePoint.timestamp - 0.05) * FPS;
    const pointShowEnd = (framePoint.timestamp + 0.05) * FPS;

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
