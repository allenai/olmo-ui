import { css } from '@allenai/varnish-panda-runtime/css';
import type { ReactNode } from 'react';
import { AbsoluteFill, OffthreadVideo } from 'remotion';

export const VideoOverlayHelper = ({
    videoUrl,
    children,
}: {
    videoUrl: string;
    children: ReactNode;
}) => {
    return (
        <AbsoluteFill>
            <AbsoluteFill>{children}</AbsoluteFill>
            <OffthreadVideo className={css({ borderRadius: 'sm' })} muted={true} src={videoUrl} />
        </AbsoluteFill>
    );
};
