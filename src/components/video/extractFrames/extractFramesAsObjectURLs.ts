import { extractFrames, type ExtractFramesTimestampsInSecondsFn } from './extractFrames';
import { videoSampleToObjectURL, type VideoSampleToObjectURLProps } from './videoSampleToObjectURL';

export type ExtractFramesAsObjectURLsProps = Omit<VideoSampleToObjectURLProps, 'sample'> & {
    src: string;
    timestampsInSeconds: number[] | ExtractFramesTimestampsInSecondsFn;
    onFrame: (objectURL: string, index: number) => void;
    signal?: AbortSignal;
};

/**
 * extracts a frame from the source file, at timestamp (in seconds)
 * and converts it into a objectURL
 *
 * returns: objectURLs, which need to be revoked by the caller (otherwise it will leak memory)
 *
 * note: useExtractFrames will cleanup with an effect and a cleanup function
 */
export const extractFramesAsObjectURLs = async ({
    src,
    timestampsInSeconds,
    onFrame,
    imageType,
    quality,
    maxWidth,
    maxHeight,
    imageSmoothingQuality,
    signal,
}: ExtractFramesAsObjectURLsProps): Promise<void> => {
    // track objectURLs for cleanup
    const urls = new Set<string>();
    let disposed = false;

    const registerURL = (url: string): string => {
        if (disposed) {
            URL.revokeObjectURL(url);
            throw new Error('ObjectURLRegistry already disposed');
        }
        urls.add(url);
        return url;
    };

    const dispose = () => {
        if (disposed) return;
        disposed = true;
        urls.forEach((url) => {
            URL.revokeObjectURL(url);
        });
        urls.clear();
    };

    // register disposal with abort signal
    if (signal) {
        signal.addEventListener('abort', dispose, { once: true });
    }

    try {
        let frameIndex = 0;
        await extractFrames({
            src,
            timestampsInSeconds,
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onVideoSample: async (sample) => {
                try {
                    const objectURL = await videoSampleToObjectURL({
                        sample,
                        imageType,
                        quality,
                        maxWidth,
                        maxHeight,
                        imageSmoothingQuality,
                    });

                    // register objectURL
                    registerURL(objectURL);

                    const idx = frameIndex++;
                    onFrame(objectURL, idx);
                } finally {
                    sample.close();
                }
            },
            signal,
        });

        // this function is done tracking the objectURLs
        // the caller now owns them (the hook will cleanup it self)
        // if manually calling this function, you will need to clean up yourself.
        if (signal) {
            signal.removeEventListener('abort', dispose);
        }
    } catch (error) {
        // call dispose (which will revoke objectURLs)
        dispose();
        if (signal) {
            signal.removeEventListener('abort', dispose);
        }
        throw error;
    }
};
