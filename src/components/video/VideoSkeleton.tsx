import { css } from '@allenai/varnish-panda-runtime/css';
import { type ReactNode } from 'react';

import { LoadingFrame } from './filmStrip/LoadingFrame';

const videoPlayerStyle = css({
    backgroundColor: 'cream.4',
    width: '[100%]',
    aspectRatio: '16/9',
    borderRadius: 'sm',
});

export const VideoPlayerSkeleton = (): ReactNode => {
    return <div className={videoPlayerStyle} />;
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
    alignItems: 'center',
    gap: '2',
});

const seekbarBarStyle = css({
    backgroundColor: 'cream.4',
    flex: '1',
    height: '[25px]',
    borderRadius: 'sm',
});

export const SeekBarSkeleton = (): ReactNode => {
    return (
        <div className={seekbarContainer}>
            <div className={seekbarBarStyle} />
        </div>
    );
};
