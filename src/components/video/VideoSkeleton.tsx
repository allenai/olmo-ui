import { css, cx } from '@allenai/varnish-panda-runtime/css';
import { type ReactNode } from 'react';

import { SvgSpinner } from '@/components/SvgSpinner';

import { LoadingFrame } from './filmStrip/LoadingFrame';

const videoPlayerStyle = css({
    backgroundColor: 'cream.4',
    width: '[100%]',
    aspectRatio: '16/9',
});

export const VideoPlayerSkeleton = ({ className }: { className?: string }): ReactNode => {
    return (
        <div className={cx(videoPlayerStyle, className)}>
            <div
                className={css({
                    display: 'flex',
                    flex: '1',
                    height: '[100%]',
                    justifyContent: 'center',

                    color: {
                        base: 'elements.primary.fill',
                        _dark: 'cream.30',
                    },
                })}>
                <SvgSpinner
                    isAnimating={true}
                    width={70}
                    height={70}
                    marginTop={40}
                    marginBlock="auto">
                    <svg
                        width="71"
                        height="72"
                        viewBox="0 0 71 72"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <g id="Ai2 Monogram">
                            <path
                                id="Vector"
                                d="M28.2823 28.2696H14.1412V14.7316H25.5251C27.045 14.7316 28.2823 13.4864 28.2823 11.9568V0.5H41.7342V14.7316C41.7342 22.2099 35.7131 28.2696 28.2823 28.2696ZM14.1412 29.657H0V43.1949H11.3839C12.9039 43.1949 14.1412 44.4401 14.1412 45.9698V57.4265H27.593V43.1949C27.593 35.7166 21.5719 29.657 14.1412 29.657ZM59.3219 28.9633C57.802 28.9633 56.5647 27.718 56.5647 26.1884V14.7316H43.1128V28.9633C43.1128 36.4416 49.1339 42.5012 56.5647 42.5012H70.7059V28.9633H59.3219ZM28.9717 57.4265V71.6582H42.4235V60.2014C42.4235 58.6718 43.6608 57.4265 45.1807 57.4265H56.5647V43.8886H42.4235C34.9928 43.8886 28.9717 49.9483 28.9717 57.4265Z"
                                fill="currentColor"
                            />
                        </g>
                    </svg>
                </SvgSpinner>
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
