import { css } from '@allenai/varnish-panda-runtime/css';
import type { PlayerRef } from '@remotion/player';
import { type ReactNode, type RefObject, useCallback, useMemo } from 'react';

import type { VideoFramePoints } from '@/components/thread/points/pointsDataTypes';
import { useExtractFrames } from '@/components/video/extractFrames/useExtractFrames';
import { SliderFadeOverflow } from '@/components/widgets/SliderFadeOverflow';

import { THUMBNAIL_HEIGHT } from './filmStripConsts';
import { Frame } from './Frame';

const frameContainerClassName = css({
    display: 'flex',
    gap: '3',
    marginInline: 'auto',
});

interface FilmStripProps {
    playerRef: RefObject<PlayerRef | null>;
    videoUrl: string;
    fps: number;
    width: number;
    height: number;
    videoPoints: VideoFramePoints;
    thumbnailHeight?: number;
}

export const FilmStrip = ({
    playerRef,
    videoUrl,
    fps,
    width,
    height,
    videoPoints,
    thumbnailHeight = THUMBNAIL_HEIGHT,
}: FilmStripProps): ReactNode => {
    const timestamps = useMemo(
        () => videoPoints.frameList.map((frame) => frame.timestamp),
        [videoPoints.frameList]
    );

    const seekToFrame = useCallback(
        (frame: number) => {
            playerRef.current?.pause();
            playerRef.current?.seekTo(frame);
        },
        [playerRef]
    );

    const thumbnailWidth = (thumbnailHeight * width) / height;

    // hook to handle frame extraction and cleanup
    const { frames, error } = useExtractFrames({
        videoUrl,
        timestamps,
        quality: 0.7,
        maxWidth: Math.round(thumbnailWidth),
        maxHeight: thumbnailHeight,
        imageSmoothingQuality: 'high',
    });

    if (error) {
        // was originally showing an error, but it only showed because of CORS
        // so for now, it either works or it doesn't
        return null;
    }

    return (
        <SliderFadeOverflow
            className={css({
                width: '[100%]',
                marginBlock: '3',
                '--background-color': '{colors.background}',
                maxWidth: '[100%]',
            })}>
            <div className={frameContainerClassName} style={{ height: `${thumbnailHeight}px` }}>
                {frames.map((frame, idx) => (
                    <Frame
                        key={`${videoPoints.frameList[idx].timestamp}-${idx}`}
                        src={frame}
                        fps={fps}
                        alt={videoPoints.alt}
                        label={videoPoints.label}
                        points={videoPoints.frameList[idx].points}
                        timestamp={videoPoints.frameList[idx].timestamp}
                        width={width}
                        height={height}
                        seekToFrame={seekToFrame}
                    />
                ))}
            </div>
        </SliderFadeOverflow>
    );
};
