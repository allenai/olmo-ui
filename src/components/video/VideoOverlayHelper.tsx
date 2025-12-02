import type { ReactNode } from 'react';
import { AbsoluteFill, OffthreadVideo } from 'remotion';

export const VideoOverlayHelper = ({
    videoUrl,
    children,
}: {
    videoUrl: string;
    children?: ReactNode;
}) => {
    return (
        <AbsoluteFill>
            <AbsoluteFill>{children}</AbsoluteFill>
            <OffthreadVideo src={videoUrl} />
        </AbsoluteFill>
    );
};
