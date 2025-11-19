import { css } from '@allenai/varnish-panda-runtime/css';
import { Video } from '@remotion/media';
import { ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';

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
            <Video className={css({ borderRadius: 'sm' })} muted={true} src={videoUrl} />
        </AbsoluteFill>
    );
};
