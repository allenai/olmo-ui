import { registerRoot } from 'remotion';
import { VideoTracking } from '../tracking/Tracking';
import { Composition } from 'remotion';

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

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                component={VideoTracking}
                durationInFrames={300}
                width={1080}
                height={1080}
                fps={30}
                id="test-render"
                defaultProps={render}
            />
            {/* Additional compositions can be rendered */}
        </>
    );
};
registerRoot(RemotionRoot);

// npx remotion studio ./src/components/video/videoProduction/test-one.tsx
