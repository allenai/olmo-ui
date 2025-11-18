import { css } from '@allenai/varnish-panda-runtime/css';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import type { ReactNode } from 'react';

import { ThumbnailImage } from './ThumbnailImage';
import { useVideoThumbnail } from './useVideoThumbnail';

interface VideoThumbnailProps {
    videoUrl: string;
    alt: string;
    title: string;
}

const placeholderContainer = css({
    borderRadius: 'sm',
    width: '[100px]',
    height: '[100px]',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

export const VideoThumbnail = ({ videoUrl, alt, title }: VideoThumbnailProps): ReactNode => {
    const videoThumbnailSrc = useVideoThumbnail({ videoUrl, offsetPercent: 0.5 });

    return videoThumbnailSrc ? (
        <ThumbnailImage src={videoThumbnailSrc} alt={alt} title={title} />
    ) : (
        <div className={placeholderContainer}>
            <VideoCameraBackIcon />
        </div>
    );
};
