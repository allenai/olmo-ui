import { useEffect, useState } from 'react';

import { extractFramesAsObjectURLs } from './extractFramesAsObjectURLs';
import type { VideoSampleToObjectURLProps } from './videoSampleToObjectURL';

type UseExtractFramesOptions = Omit<VideoSampleToObjectURLProps, 'sample'> & {
    videoUrl: string;
    timestamps: number[];
};

type UseExtractFramesResult = {
    frames: Array<string | undefined>;
    error: Error | null;
    isLoading: boolean;
};

/**
 * Handles calling the frame extration functions and cleanup of objectURLs
 */
export function useExtractFrames({
    videoUrl,
    imageType,
    timestamps,
    quality,
    maxWidth,
    maxHeight,
    imageSmoothingQuality,
}: UseExtractFramesOptions): UseExtractFramesResult {
    const [frames, setFrames] = useState<(string | undefined)[]>(
        Array.from({ length: timestamps.length })
    );
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // for effect dep:
    const timestampsKey = timestamps.join(',');

    useEffect(() => {
        const abortController = new AbortController();
        const frameCount = timestamps.length;

        const loadFrames = async () => {
            try {
                setError(null);
                setIsLoading(true);

                await extractFramesAsObjectURLs({
                    imageType,
                    src: videoUrl,
                    timestampsInSeconds: timestamps,
                    quality,
                    maxWidth,
                    maxHeight,
                    imageSmoothingQuality,
                    onFrame: (objectURL, index) => {
                        setFrames((prev) => {
                            const next = [...prev];
                            next[index] = objectURL;
                            return next;
                        });
                    },
                    signal: abortController.signal,
                });

                setIsLoading(false);
            } catch (err) {
                if (!abortController.signal.aborted) {
                    setError(err instanceof Error ? err : new Error('Failed to extract frames'));
                    setIsLoading(false);
                }
            }
        };

        void loadFrames();

        // cleanup
        return () => {
            // abort cleans up any still registered objectURLs
            abortController.abort();

            // for objectURLs we hold in state, we need to revoke those ourselves.
            setFrames((currentFrames) => {
                currentFrames.forEach((frame) => {
                    if (frame) {
                        URL.revokeObjectURL(frame);
                    }
                });

                // set state back to undefined, which is our "loading"/empty state for the Frames
                return Array.from({ length: frameCount });
            });

            setIsLoading(false);
        };
    }, [videoUrl, timestampsKey, quality, maxWidth, maxHeight, imageSmoothingQuality]);

    return { frames, error, isLoading };
}
