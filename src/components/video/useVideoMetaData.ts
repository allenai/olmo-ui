import { useEffect, useState } from 'react';

type VideoMetaData = {
    durationInFrames: number;
    width: number;
    height: number;
    isLoading: boolean;
};

export const useVideoMetaData = (videoUrl: string, fps: number): VideoMetaData => {
    const [metaData, setMetaData] = useState<VideoMetaData>({
        durationInFrames: 1,
        width: 1,
        height: 1,
        isLoading: true,
    });

    useEffect(() => {
        // guard state changes on unmounted component
        let disposed = false;

        // on effect, set loading = true
        setMetaData((prev) => ({ ...prev, isLoading: true }));

        const videoElement = document.createElement('video');
        videoElement.src = videoUrl;

        const handleLoadedMetadata = () => {
            if (disposed) return;

            const durationInSeconds = videoElement.duration;
            const frames = Math.round(durationInSeconds * fps);
            setMetaData({
                durationInFrames: frames + 1,
                width: videoElement.videoWidth,
                height: videoElement.videoHeight,
                isLoading: false,
            });
        };

        const handleError = () => {
            if (disposed) return;

            console.error('Failed to load video metadata:', videoElement.error);
            // retain state, but set loading = false
            setMetaData((prev) => ({ ...prev, isLoading: false }));
        };

        videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.addEventListener('error', handleError);

        return () => {
            disposed = true;
            videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
            videoElement.removeEventListener('error', handleError);
            videoElement.src = '';
        };
    }, [videoUrl, fps]);

    return metaData;
};
