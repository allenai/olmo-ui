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
        'https://storage.googleapis.com/ai2-playground-molmo/msg_T9E6Z3M2B6/msg_T9E6Z3M2B6-0.mp4',
    videoTrackingPoints: {
        label: 'orange toy that slides in from the left towards the beginning of the clip',
        type: 'track-points',
        frameList: [
            {
                timestamp: 2,
                tracks: [
                    {
                        trackId: '1',
                        x: 18.4,
                        y: 73.1,
                    },
                ],
            },
            {
                timestamp: 2.5,
                tracks: [
                    {
                        trackId: '1',
                        x: 36.6,
                        y: 70,
                    },
                ],
            },
            {
                timestamp: 3,
                tracks: [
                    {
                        trackId: '1',
                        x: 51.1,
                        y: 70.6,
                    },
                ],
            },
            {
                timestamp: 3.5,
                tracks: [
                    {
                        trackId: '1',
                        x: 57,
                        y: 68.8,
                    },
                ],
            },
            {
                timestamp: 4,
                tracks: [
                    {
                        trackId: '1',
                        x: 61.2,
                        y: 68.1,
                    },
                ],
            },
            {
                timestamp: 4.5,
                tracks: [
                    {
                        trackId: '1',
                        x: 62.3,
                        y: 67.8,
                    },
                ],
            },
            {
                timestamp: 5,
                tracks: [
                    {
                        trackId: '1',
                        x: 62.5,
                        y: 67.8,
                    },
                ],
            },
            {
                timestamp: 5.5,
                tracks: [
                    {
                        trackId: '1',
                        x: 62.6,
                        y: 67.8,
                    },
                ],
            },
            {
                timestamp: 6,
                tracks: [
                    {
                        trackId: '1',
                        x: 53,
                        y: 64.4,
                    },
                ],
            },
            {
                timestamp: 6.5,
                tracks: [
                    {
                        trackId: '1',
                        x: 52.7,
                        y: 65,
                    },
                ],
            },
            {
                timestamp: 7,
                tracks: [
                    {
                        trackId: '1',
                        x: 36.6,
                        y: 65,
                    },
                ],
            },
            {
                timestamp: 7.5,
                tracks: [
                    {
                        trackId: '1',
                        x: 27.7,
                        y: 64.4,
                    },
                ],
            },
            {
                timestamp: 8,
                tracks: [
                    {
                        trackId: '1',
                        x: 22.7,
                        y: 64.4,
                    },
                ],
            },
            {
                timestamp: 8.5,
                tracks: [
                    {
                        trackId: '1',
                        x: 25.5,
                        y: 64.4,
                    },
                ],
            },
            {
                timestamp: 9,
                tracks: [
                    {
                        trackId: '1',
                        x: 27.7,
                        y: 64.4,
                    },
                ],
            },
            {
                timestamp: 9.5,
                tracks: [
                    {
                        trackId: '1',
                        x: 22,
                        y: 67.8,
                    },
                ],
            },
            {
                timestamp: 10,
                tracks: [
                    {
                        trackId: '1',
                        x: 19.5,
                        y: 70,
                    },
                ],
            },
            {
                timestamp: 10.5,
                tracks: [
                    {
                        trackId: '1',
                        x: 18,
                        y: 70.6,
                    },
                ],
            },
            {
                timestamp: 11,
                tracks: [
                    {
                        trackId: '1',
                        x: 16.6,
                        y: 70,
                    },
                ],
            },
            {
                timestamp: 11.5,
                tracks: [
                    {
                        trackId: '1',
                        x: 18.4,
                        y: 71.2,
                    },
                ],
            },
            {
                timestamp: 12,
                tracks: [
                    {
                        trackId: '1',
                        x: 41.6,
                        y: 72.8,
                    },
                ],
            },
            {
                timestamp: 12.5,
                tracks: [
                    {
                        trackId: '1',
                        x: 83,
                        y: 71.2,
                    },
                ],
            },
            {
                timestamp: 17,
                tracks: [
                    {
                        trackId: '1',
                        x: 95.5,
                        y: 77.8,
                    },
                ],
            },
            {
                timestamp: 19.5,
                tracks: [
                    {
                        trackId: '1',
                        x: 49.5,
                        y: 73.1,
                    },
                ],
            },
            {
                timestamp: 20,
                tracks: [
                    {
                        trackId: '1',
                        x: 48.8,
                        y: 72.8,
                    },
                ],
            },
            {
                timestamp: 20.5,
                tracks: [
                    {
                        trackId: '1',
                        x: 49.1,
                        y: 72.8,
                    },
                ],
            },
            {
                timestamp: 21,
                tracks: [
                    {
                        trackId: '1',
                        x: 49.5,
                        y: 71.2,
                    },
                ],
            },
            {
                timestamp: 21.5,
                tracks: [
                    {
                        trackId: '1',
                        x: 53.8,
                        y: 68.1,
                    },
                ],
            },
            {
                timestamp: 22,
                tracks: [
                    {
                        trackId: '1',
                        x: 55.9,
                        y: 64.4,
                    },
                ],
            },
            {
                timestamp: 22.5,
                tracks: [
                    {
                        trackId: '1',
                        x: 56.2,
                        y: 61.9,
                    },
                ],
            },
        ],
    },
    showInterpolation: true,
};
// getMediaMetadata(render.videoUrl);

const fps = 30;
const durationInFrames = 680;

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
