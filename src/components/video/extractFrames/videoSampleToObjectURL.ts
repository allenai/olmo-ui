import { VideoSample } from 'mediabunny';

export type VideoSampleToObjectURLProps = {
    sample: VideoSample;
    imageType?: string;
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
    imageSmoothingQuality?: ImageSmoothingQuality;
};

/**
 * renders a VideoSample using canvas and returns an objectURL
 *   optionally downscales the size for use with thumbnails
 *
 * returns objectURLs, which need to be revoked by the caller (otherwise it will leak memory)
 */
export const videoSampleToObjectURL = async ({
    sample,
    imageType = 'image/webp', // spec default is png
    quality, // default = dealer's (browser) choice
    maxWidth,
    maxHeight,
    imageSmoothingQuality = 'high',
}: VideoSampleToObjectURLProps): Promise<string> => {
    let width = sample.displayWidth;
    let height = sample.displayHeight;

    if (maxWidth || maxHeight) {
        const aspectRatio = width / height;

        if (maxWidth && width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
        }

        if (maxHeight && height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
        }
    }

    const canvas = new OffscreenCanvas(Math.round(width), Math.round(height));
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Failed to get canvas context');
    }

    // set downscaling quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = imageSmoothingQuality;

    const videoFrame = sample.toVideoFrame();
    try {
        ctx.drawImage(videoFrame, 0, 0, Math.round(width), Math.round(height));
        const blob = await canvas.convertToBlob({ type: imageType, quality });
        return URL.createObjectURL(blob);
    } finally {
        videoFrame.close();
    }
};
