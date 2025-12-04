import { css } from '@allenai/varnish-panda-runtime/css';
import { cx } from '@allenai/varnish-ui';
import { PropsWithChildren, type ReactNode } from 'react';

const playerContainerClassName = css({
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

export const VideoPlayerWrapper = ({
    children,
    className,
}: PropsWithChildren<{ className?: string }>) => {
    return <div className={cx(wrapperClassName, className)}>{children}</div>;
};
