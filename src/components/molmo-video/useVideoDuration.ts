import { useEffect, useState } from 'react';
/**
 * Custom hook to calculate video duration in frames
 * @param videoUrl - URL of the video
 * @param fps - Frames per second
 * @returns Duration in frames, or null if not yet loaded
 */
export const useVideoDuration = (videoUrl: string, fps: number): number => {
    const [durationInFrames, setDurationInFrames] = useState<number>(1);

    useEffect(() => {
        const videoElement = document.createElement('video');
        videoElement.src = videoUrl;

        const handleLoadedMetadata = () => {
            const durationInSeconds = videoElement.duration;
            const frames = Math.round(durationInSeconds * fps);
            setDurationInFrames(frames);
        };

        videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);

        return () => {
            videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
            videoElement.src = '';
        };
    }, [videoUrl, fps]);

    return durationInFrames;
};
