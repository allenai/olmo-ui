import { useEffect, useState } from 'react';

type VideoMetaData = {
    durationInFrames: number;
    width: number;
    height: number;
};

export const useVideoMetaData = (videoUrl: string, fps: number): VideoMetaData => {
    const [durationInFrames, setDurationInFrames] = useState<VideoMetaData>({
        durationInFrames: 1,
        width: 1,
        height: 1,
    });

    useEffect(() => {
        const videoElement = document.createElement('video');
        videoElement.src = videoUrl;

        const handleLoadedMetadata = () => {
            const durationInSeconds = videoElement.duration;
            const frames = Math.round(durationInSeconds * fps);
            setDurationInFrames({
                durationInFrames: frames + 1,
                width: videoElement.videoWidth,
                height: videoElement.videoHeight,
            });
        };

        videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);

        return () => {
            videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
            videoElement.src = '';
        };
    }, [videoUrl, fps]);

    return durationInFrames;
};
