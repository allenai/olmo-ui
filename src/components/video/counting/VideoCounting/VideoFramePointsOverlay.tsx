import { css } from '@allenai/varnish-panda-runtime/css';
import { varnishTheme } from '@allenai/varnish2/theme';
import { memo, type ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import type { Point } from '@/components/thread/points/pointsDataTypes';

// show the point for more than a frame
// but not to look like tracking
//
// NOTE: setting these too low can cause points to "bleed" onto adjacent frames
// these values work for 0.5s steps, but not less
const POINT_DURATION = 0.2;
const PRE_TIMESTAMP_OFFSET = 0.2; // How long before the frame does the dot appear.
const POST_TIMESTAMP_OFFSET = 0.2; // How long after the frame does the dot linger.

const svgClassName = css({
    position: 'absolute',
    inset: '0',
});

interface VideFramePointsOverlay {
    timestamp: number;
    points: Point[];
}

export const VideoFramePointsOverlay = memo(function VideoFramePoints({
    timestamp,
    points,
}: VideFramePointsOverlay): ReactNode {
    const { height, width, fps } = useVideoConfig();
    const frame = useCurrentFrame();

    const frameMin = (timestamp - PRE_TIMESTAMP_OFFSET) * fps;
    const frameMax = (timestamp + POST_TIMESTAMP_OFFSET) * fps;

    if (frame < frameMin || frame > frameMax) {
        return null;
    }

    const onFrameMin = (timestamp - POINT_DURATION / 2) * fps;
    const onFrameMax = (timestamp + POINT_DURATION / 2) * fps;
    const onFrame = frame > onFrameMin && frame < onFrameMax;

    return (
        <svg className={svgClassName} width={width} height={height}>
            {points.map(({ x, y, pointId }) => (
                <circle
                    key={pointId}
                    cy={`${y}%`}
                    cx={`${x}%`}
                    r={'1.5%'}
                    stroke={'white'}
                    strokeWidth={'0.3%'}
                    fill={onFrame ? varnishTheme.palette.primary.main : 'transparent'}
                />
            ))}
        </svg>
    );
});
