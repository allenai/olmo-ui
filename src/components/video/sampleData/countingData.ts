import { VideoFramePoints } from '@/components/thread/points/pointsDataTypes';

export const MCLAREN_VIDEO_COUNTING_DATA = {
    label: 'cars',
    type: 'frame-points',
    frameList: [
        {
            timestamp: 0,
            points: [
                { pointId: '1', x: 22.1, y: 75.4 },
                { pointId: '2', x: 51.4, y: 48.5 },
                { pointId: '3', x: 57.7, y: 43.5 },
                { pointId: '4', x: 66.6, y: 50.4 },
                { pointId: '5', x: 73.4, y: 35.4 },
                { pointId: '6', x: 73.6, y: 22.4 },
                { pointId: '7', x: 76.4, y: 13.5 },
                { pointId: '8', x: 97.1, y: 67.1 },
            ],
        },
        { timestamp: 1.5, points: [{ pointId: '9', x: 89.9, y: 8.9 }] },
        {
            timestamp: 4,
            points: [
                { pointId: '10', x: 9.9, y: 81.9 },
                { pointId: '11', x: 96.6, y: 9.1 },
            ],
        },
    ],
} satisfies VideoFramePoints;
