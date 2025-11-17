import { useEffect, useState } from 'react';

type UseVideoThumbnailProps = {
    videoUrl: string;
} & (
    | {
          offsetTime: number;
          offsetPercent?: never;
      }
    | {
          offsetPercent: number;
          offsetTime?: never;
      }
);

export const useVideoThumbnail = ({
    videoUrl,
    offsetTime,
    offsetPercent,
}: UseVideoThumbnailProps): string | undefined => {
    const [thumbnail, setThumbnail] = useState<string>();

    useEffect(() => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');

        const handleLoadedMetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            video.currentTime = offsetTime ?? video.duration * offsetPercent;
        };

        const handleSeeked = () => {
            canvas.getContext('2d')?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const imageUrl = canvas.toDataURL('image/png');
            setThumbnail(imageUrl);
        };

        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('seeked', handleSeeked);
        video.src = videoUrl;

        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('seeked', handleSeeked);
            video.remove();
            canvas.remove();
        };
    }, [videoUrl, offsetTime, offsetPercent]);

    return thumbnail;
};
