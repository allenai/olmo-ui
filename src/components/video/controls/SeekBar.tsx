import { sva } from '@allenai/varnish-panda-runtime/css';
import { cx } from '@allenai/varnish-ui';
import { memo } from 'react';
import { Button } from 'react-aria-components';

import { useControls } from './context/ControlsContext';
import { useCurrentFrame } from './context/useCurrentFrame';
import { useTimeline } from './context/useTimeline';
import { TrackingDotsTimeline } from './TrackingDotsTimeLine';
import { useSeekBarDrag } from './useSeekBarDrag';

interface SeekBarProps {
    frameStyle: 'dot' | 'line';
    knobBehindMarkers?: boolean;
}

export const SeekBar = memo(function SeekBar({ frameStyle }: SeekBarProps) {
    const { framePoints } = useControls();
    const frame = useCurrentFrame();
    const { fps, durationInFrames, handleKeyDown } = useTimeline();
    const { containerRef, dragging, handlePointerDown } = useSeekBarDrag();

    const seekBarClassName = seekbar({ frameStyle });

    return (
        <div
            role="slider"
            aria-label="Video progress"
            aria-valuemin={0}
            aria-valuemax={(durationInFrames - 1) / fps}
            aria-valuenow={frame / fps}
            tabIndex={-1} // focus on knob seems more correct
            className={seekBarClassName.container}
            onKeyDown={handleKeyDown}>
            <div
                className={seekBarClassName.played}
                style={{
                    width: `calc(${(frame / (durationInFrames - 1)) * 100}%)`,
                }}
            />
            <div
                ref={containerRef}
                onPointerDown={handlePointerDown}
                className={seekBarClassName.inner}>
                <div
                    id="knob-background"
                    className={cx(seekBarClassName.knob, seekBarClassName.knobBackground)}
                    data-dragging={String(dragging)}
                    style={{
                        left: `calc(${(frame / (durationInFrames - 1)) * 100}%)`,
                    }}
                />
                {framePoints ? (
                    <TrackingDotsTimeline
                        fps={fps}
                        durationInFrames={durationInFrames}
                        data={framePoints}
                        frameClassName={seekBarClassName.marker}
                    />
                ) : null}
                <Button
                    id="knob"
                    onPointerDown={handlePointerDown}
                    className={cx(seekBarClassName.knob, seekBarClassName.knobRing)}
                    data-dragging={String(dragging)}
                    style={{
                        left: `calc(${(frame / (durationInFrames - 1)) * 100}%)`,
                    }}
                />
            </div>
        </div>
    );
});

const seekbar = sva({
    slots: ['container', 'inner', 'played', 'knob', 'knobBackground', 'knobRing', 'marker'],
    base: {
        container: {
            '--bar-height': '{spacing.3}',
            '--timeline-padding': '6px', // half the height
            '--knob-border-width': '2px',
            '--knob-size': 'calc(var(--bar-height))',

            userSelect: 'none',
            boxSizing: 'border-box',
            cursor: 'pointer',
            position: 'relative',
            touchAction: 'none',
            borderRadius: 'full',
            flex: '1',

            backgroundColor: 'background.opacity-20',
            outline: 'none',
            outlineOffset: '0',

            _focusVisible: {
                outlineColor: 'cream.50',
            },
        },
        played: {
            position: 'absolute',
            left: '0',
            height: 'var(--bar-height)',
            paddingInline: 'var(--timeline-padding)',
            backgroundColor: 'teal.100',
            borderLeftRadius: 'full',
        },
        inner: {
            height: 'var(--bar-height)',
            width: '[calc(100% - 2 * var(--timeline-padding))]',
            marginInline: 'var(--timeline-padding)',
            position: 'relative',
            isolation: 'isolate',
        },
        knob: {
            height: 'var(--knob-size)',
            width: 'var(--knob-size)',

            borderRadius: 'full',

            transform: '[translateX(-50%)]',

            position: 'absolute',
            cursor: 'grab',
            top: '0',

            _dragging: {
                cursor: 'grabbing',
            },
            _focusVisible: {
                outline: 'none',
                borderColor: 'cream.80',
            },
        },
        knobBackground: {
            backgroundColor: 'elements.primary.contrast',
        },
        knobRing: {
            outline: 'var(--knob-border-width) solid',
            outlineColor: 'background.opacity-50',
        },
        marker: {
            position: 'absolute',
            backgroundColor: 'pink.100',
        },
    },
    variants: {
        frameStyle: {
            dot: {
                marker: {
                    '--tracking_dot_size': '{spacing.3}',
                    borderRadius: 'full',
                    width: 'var(--tracking_dot_size)',
                    height: 'var(--tracking_dot_size)',
                },
            },
            line: {
                marker: {
                    '--tracking_dot_size': '2px',
                    width: 'var(--tracking_dot_size)',
                    height: '[100%]',
                },
            },
        },
        // configurable knob indexing
        knobBehindMarkers: {
            true: {
                // style one way
            },
            false: {
                // style another way
                knob: {
                    zIndex: '[1]',
                },
            },
        },
    },
    defaultVariants: {
        frameStyle: 'dot',
        knobBehindMarkers: false,
    },
});
