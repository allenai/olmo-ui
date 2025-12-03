import { Composition, registerRoot } from 'remotion';

import { VideoTracking } from '../tracking/Tracking';

import { Input, ALL_FORMATS, UrlSource } from 'mediabunny';

export const getMediaMetadata = async (src: string) => {
    const input = new Input({
        formats: ALL_FORMATS,
        source: new UrlSource(src, {
            getRetryDelay: () => null,
        }),
    });

    const durationInSeconds = await input.computeDuration();
    const videoTrack = await input.getPrimaryVideoTrack();
    const dimensions = videoTrack
        ? {
              width: videoTrack.displayWidth,
              height: videoTrack.displayHeight,
          }
        : null;
    const packetStats = await videoTrack?.computePacketStats(50);
    const fps = packetStats?.averagePacketRate ?? null;

    console.log(fps);
    console.log(durationInSeconds * fps!);
    console.log(dimensions);
    return {
        durationInSeconds,
        dimensions,
        fps,
    };
};
const render = {
    videoUrl:
        'https://storage.googleapis.com/ai2-playground-molmo/msg_K5R0Y9X7W3/msg_K5R0Y9X7W3-0.mp4',
    videoTrackingPoints: {
        label: 'dog',
        type: 'track-points',
        frameList: [
            {
                timestamp: 0,
                tracks: [
                    {
                        trackId: '1',
                        x: 51.6,
                        y: 66.5,
                    },
                ],
            },
            {
                timestamp: 0.5,
                tracks: [
                    {
                        trackId: '1',
                        x: 41.9,
                        y: 60.6,
                    },
                ],
            },
            {
                timestamp: 1,
                tracks: [
                    {
                        trackId: '1',
                        x: 39.8,
                        y: 57.6,
                    },
                ],
            },
            {
                timestamp: 1.5,
                tracks: [
                    {
                        trackId: '1',
                        x: 41.6,
                        y: 58.9,
                    },
                ],
            },
            {
                timestamp: 2,
                tracks: [
                    {
                        trackId: '1',
                        x: 44.1,
                        y: 59.4,
                    },
                ],
            },
            {
                timestamp: 2.5,
                tracks: [
                    {
                        trackId: '1',
                        x: 50.5,
                        y: 61.2,
                    },
                ],
            },
            {
                timestamp: 3,
                tracks: [
                    {
                        trackId: '1',
                        x: 53.8,
                        y: 59.4,
                    },
                ],
            },
        ],
    },
    showInterpolation: true,
};

//getMediaMetadata(render.videoUrl);

const fps = 24;
const durationInFrames = 75;

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                component={VideoTracking}
                durationInFrames={durationInFrames}
                width={1920}
                height={1080}
                fps={fps!}
                id="test-render"
                defaultProps={render}
            />
            {/* Additional compositions can be rendered */}
        </>
    );
};
registerRoot(RemotionRoot);
// npx remotion studio ./src/components/video/videoProduction/test-one.tsx
