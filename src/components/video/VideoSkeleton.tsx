import { css } from '@allenai/varnish-panda-runtime/css';
import { type ReactNode } from 'react';

import { ImageSpinner } from '@/components/ImageSpinner';

import { LoadingFrame } from './filmStrip/LoadingFrame';

const videoPlayerStyle = css({
    backgroundColor: 'cream.4',
    width: '[100%]',
    aspectRatio: '16/9',
    borderTopRadius: 'sm',
});

export const VideoPlayerSkeleton = (): ReactNode => {
    return (
        <div className={videoPlayerStyle}>
            <div
                className={css({
                    display: 'flex',
                    flex: '1',
                    height: '[100%]',
                    justifyContent: 'center',
                })}>
                <ImageSpinner
                    src="/ai2-monogram.svg"
                    isAnimating={true}
                    width={70}
                    height={70}
                    marginTop={40}
                    alt=""
                    marginBlock="auto" // maybe
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
