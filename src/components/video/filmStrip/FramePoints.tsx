import { css } from '@allenai/varnish-panda-runtime/css';
import { varnishTheme } from '@allenai/varnish2/theme';
import { memo, type ReactNode } from 'react';

import { Point } from '@/components/thread/points/pointsDataTypes';

const svgClassName = css({
    position: 'absolute',
    top: '0',
    left: '0',
    width: '[100%]',
    height: '[100%]',
});

interface FramePointsProps {
    points: Point[];
}

export const FramePoints = memo(function FramePoints({ points }: FramePointsProps): ReactNode {
    return (
        <svg className={svgClassName}>
            {points.map(({ x, y, pointId }) => (
                <circle
                    key={pointId}
                    cy={`${y}%`}
                    cx={`${x}%`}
                    r="4px"
                    stroke={'white'}
                    strokeWidth={'2px'}
                    fill={varnishTheme.palette.primary.main}
                />
            ))}
        </svg>
    );
});
