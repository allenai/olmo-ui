import { css, cx } from '@allenai/varnish-panda-runtime/css';
import { CircularProgress } from '@mui/material';
import { type ReactNode } from 'react';
import { useCurrentScale } from 'remotion';

import { LoadingFrame } from './filmStrip/LoadingFrame';

const videoPlayerStyle = css({
    backgroundColor: 'cream.4',
    width: '[100%]',
    aspectRatio: '16/9',
});

export const VideoPlayerSkeleton = ({ className }: { className?: string }): ReactNode => {
    const scale = useCurrentScale({
        dontThrowIfOutsideOfRemotion: true, // will return 1 outside of remotion
    });
    return (
        <div className={cx(videoPlayerStyle, className)}>
            <div
                style={{
                    scale: `${1 / scale}`,
                }}
                className={css({
                    display: 'flex',
                    flex: '1',
                    height: '[100%]',
                    justifyContent: 'center',
                })}>
                <CircularProgress
                    size={70}
                    sx={{
                        marginBlock: 'auto',
                    }}
                />
            </div>
        </div>
    );
};

const filmstripContainer = css({
    display: 'flex',
    height: '[100px]',
    gap: '3',
    overflowX: 'auto',
});

export const FilmStripSkeleton = ({
    thumbnailCount = 4,
}: {
    thumbnailCount?: number;
}): ReactNode => {
    return (
        <div className={filmstripContainer}>
            {Array.from({ length: thumbnailCount }).map((_, i) => (
                <LoadingFrame key={i} />
            ))}
        </div>
    );
};

const seekbarContainer = css({
    display: 'flex',
    height: '[56px]',
    gap: '2',

    backgroundColor: {
        base: 'white',
        _dark: 'cream.10',
    },
    borderBottomRadius: 'sm',

    paddingInline: '3',
    paddingBlockStart: '2',
    paddingBlockEnd: '1',
});

const seekbarBarStyle = css({
    flex: '1',
    height: '[12px]',
    borderRadius: 'full',
    backgroundColor: {
        base: 'cream.50',
        _dark: 'cream.4',
    },
});

export const SeekBarSkeleton = (): ReactNode => {
    return (
        <div className={seekbarContainer}>
            <div className={seekbarBarStyle} />
        </div>
    );
};
