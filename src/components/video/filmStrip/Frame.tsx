import { css } from '@allenai/varnish-panda-runtime/css';
import { memo, type ReactNode } from 'react';
import { Button } from 'react-aria-components';

import type { Point } from '@/components/thread/points/pointsDataTypes';

import { FramePoints } from './FramePoints';
import { LoadingFrame } from './LoadingFrame';

const buttonClassNames = css({
    position: 'relative',
    display: 'flex',
    flexShrink: 0,
    height: '[100%]',
    overflow: 'hidden',
    borderRadius: 'sm',
    border: '2px solid transparent',
    _focus: {
        borderColor: 'accent.secondary',
    },
    cursor: 'pointer',
});

const imageClassNames = css({
    display: 'flex',
    height: '[100%]',
    width: '[100%]',
});

interface FrameProps {
    src?: string;
    fps: number;
    alt?: string;
    label?: string;
    points: Point[];
    timestamp: number;
    width: number;
    height: number;
    seekToFrame: (frame: number) => void;
}

export const Frame = memo(function Frame({
    src,
    fps,
    alt,
    label,
    points,
    timestamp,
    width,
    height,
    seekToFrame,
}: FrameProps): ReactNode {
    const aspectRatio = `${width}/${height}`;

    const handlePress = () => {
        seekToFrame(timestamp * fps);
    };

    if (!src) {
        return <LoadingFrame aspectRatio={aspectRatio} />;
    }

    return (
        <Button
            onPress={handlePress}
            aria-label={label}
            className={buttonClassNames}
            style={{ aspectRatio }}>
            <img src={src} alt={alt} className={imageClassNames} />
            <FramePoints points={points} />
        </Button>
    );
});
