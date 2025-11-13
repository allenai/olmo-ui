import { varnishTheme } from '@allenai/varnish2/theme';
import { useVideoConfig } from 'remotion';

import { TrackPoint } from '@/components/thread/points/pointsDataTypes';

export const SVGPoint = ({
    point,
    circleRadius = 10,
}: {
    point: TrackPoint;
    circleRadius: number;
}) => {
    const { height, width } = useVideoConfig();

    return (
        <svg width={width} height={height}>
            <circle
                cy={`${point.y * 100}%`}
                cx={`${point.x * 100}%`}
                r={circleRadius}
                stroke="white"
                strokeWidth="3"
                fill={varnishTheme.palette.primary.main}
            />
        </svg>
    );
};
