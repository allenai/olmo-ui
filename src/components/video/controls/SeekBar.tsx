import { css, sva } from '@allenai/varnish-panda-runtime/css';
import { Button } from '@allenai/varnish-ui';
import { PauseRounded, PlayArrowRounded } from '@mui/icons-material';
import type { PlayerRef } from '@remotion/player';
import React, {
    forwardRef,
    KeyboardEventHandler,
    PointerEventHandler,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { interpolate } from 'remotion';

import type {
    VideoFramePoints,
    VideoTrackingPoints,
} from '@/components/thread/points/pointsDataTypes';

import { TrackingDotsTimeline } from './TrackingDotsTimeLine';
import { useElementSize } from './useElementSize';
import { useOnKeyDownControls } from './useOnKeyDownControls';

const getFrameFromX = (clientX: number, durationInFrames: number, width: number) => {
    const pos = clientX;
    const frame = Math.round(
        interpolate(pos, [0, width], [0, Math.max(durationInFrames - 1, 0)], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        })
    );
    return frame;
};

interface SeekBarProps {
    durationInFrames: number;
    frame: number;
    fps: number;
    frameStyle: 'dot' | 'line';
    //
    videoPoints: VideoTrackingPoints | VideoFramePoints;
    //
    onKeyDownControls: KeyboardEventHandler<HTMLElement>;
    onPointerDown: PointerEventHandler<HTMLElement>;
    dragging: boolean;
}

export const SeekBar = forwardRef<HTMLDivElement, SeekBarProps>(function SeekBar(
    {
        durationInFrames,
        frame,
        fps,
        frameStyle,
        videoPoints,
        onKeyDownControls,
        onPointerDown,
        dragging,
    },
    containerRef
) {
    const seekBarClassName = seekbar({ frameStyle });

    return (
        <div
            role="slider"
            aria-label="Video progress"
            aria-valuemin={0}
            aria-valuemax={(durationInFrames - 1) / fps}
            aria-valuenow={frame / fps}
            tabIndex={0}
            className={seekBarClassName.container}
            onKeyDown={onKeyDownControls}>
            <div
                ref={containerRef}
                onPointerDown={onPointerDown}
                className={seekBarClassName.inner}>
                <div
                    style={{
                        //
                        width: `calc(${(frame / (durationInFrames - 1)) * 100}% + var(--timeline-padding) )`,
                    }}
                    className={seekBarClassName.barFill}
                />
                <TrackingDotsTimeline
                    fps={fps}
                    durationInFrames={durationInFrames}
                    data={videoPoints}
                    frameClassName={seekBarClassName.frame}
                />
                <div
                    id="knob"
                    className={seekBarClassName.knob}
                    data-dragging={String(dragging)}
                    style={{
                        left: `calc(${(frame / (durationInFrames - 1)) * 100}% - var(--knob-width) / 2)`,
                    }}
                />
            </div>
        </div>
    );
});

const seekbar = sva({
    slots: ['container', 'inner', 'barFill', 'knob', 'frame'],
    base: {
        container: {
            '--bar-height': '25px',
            '--timeline-padding': '10px',

            paddingInline: 'var(--timeline-padding, 10px)',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            boxSizing: 'border-box',
            cursor: 'pointer',
            position: 'relative',
            touchAction: 'none',
            backgroundColor: 'white',
            borderRadius: 'sm',
            borderWidth: '2',
            borderColor: 'pink.30',
            flex: '1',
        },
        inner: {
            height: 'var(--bar-height)',
            width: 'auto',
            position: 'relative',
        },
        barFill: {
            height: 'var(--bar-height)',
            backgroundColor: 'pink.20',
            borderRadius: 'sm',
            position: 'absolute',
            marginLeft: `[calc( -1 * var(--timeline-padding) )]`,
            left: '0',
        },
        knob: {
            '--knob-width': '10px',
            height: '[calc(var(--bar-height) + 10px)]',
            width: 'var(--knob-width)',
            borderRadius: 'sm',
            position: 'absolute',
            cursor: 'grab',
            top: '[-5px]',
            backgroundColor: 'teal.100',
            '&[data-dragging=true]': {
                cursor: 'grabbing',
            },
        },
        frame: {
            position: 'absolute',
            backgroundColor: 'pink.100',
            top: '2',
        },
    },
    variants: {
        frameStyle: {
            dot: {
                frame: {
                    '--tracking_dot_size': '10px',
                    borderRadius: 'full',
                    width: 'var(--tracking_dot_size)',
                    height: 'var(--tracking_dot_size)',
                },
            },
            line: {
                frame: {
                    '--tracking_dot_size': '1px',
                    width: 'var(--tracking_dot_size)',
                    height: '[100%]',
                },
            },
        },
    },
    defaultVariants: {
        frameStyle: 'dot',
    },
});