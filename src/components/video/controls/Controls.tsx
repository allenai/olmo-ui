import { css } from '@allenai/varnish-panda-runtime/css';
import { styled } from '@allenai/varnish-panda-runtime/jsx';
import type { PlayerRef } from '@remotion/player';
import { memo, type PropsWithChildren, type RefObject } from 'react';

import type {
    VideoFramePoints,
    VideoTrackingPoints,
} from '@/components/thread/points/pointsDataTypes';

import { ControlsProvider } from './context/ControlsContext';

type ControlsProps = {
    playerRef: RefObject<PlayerRef | null>;
    framePoints: VideoTrackingPoints | VideoFramePoints;
    fps: number;
    durationInFrames: number;
};

// Adapted from https://www.remotion.dev/docs/player/custom-controls#seek-bar
export const Controls = memo(function Controls({
    framePoints,
    playerRef,
    fps,
    durationInFrames,
    children,
}: PropsWithChildren<ControlsProps>) {
    return (
        <ControlsProvider
            playerRef={playerRef}
            fps={fps}
            durationInFrames={durationInFrames}
            framePoints={framePoints}>
            <div className={controlsContainer}>{children}</div>
        </ControlsProvider>
    );
});

const controlsContainer = css({
    backgroundColor: {
        base: 'white/50',
        _dark: 'background.opacity-4',
    },
    display: 'grid',
    gap: '2',
    paddingInline: '3',
    paddingBlockStart: '2',
    paddingBlockEnd: '1',
    borderBottomRadius: 'sm',
});

export const SplitControls = styled('div', {
    base: {
        display: 'flex',
        justifyContent: 'space-between',
    },
});

export const ControlsGroup = styled('div', {
    base: {
        display: 'flex',
        gap: '2',
    },
});
