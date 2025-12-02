import { css } from '@allenai/varnish-panda-runtime/css';
import { PropsWithChildren, type ReactNode } from 'react';

const playerContainerClassName = css({
    maxHeight: '[60vh]',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
});

const wrapperClassName = css({
    display: 'grid',
});

export const VideoPlayerContainer = ({ children }: PropsWithChildren): ReactNode => {
    return <div className={playerContainerClassName}>{children}</div>;
};

export const VideoPlayerWrapper = ({ children }: PropsWithChildren) => {
    return <div className={wrapperClassName}>{children}</div>;
};
