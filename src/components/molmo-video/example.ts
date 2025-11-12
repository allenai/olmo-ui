import {
    VideoTrackingPoints,
    PerFrameTrackPoints,
} from '@/components/thread/points/pointsDataTypes';

export const mclaren: PerFrameTrackPoints[] = [
    {
        timestamp: 1.8333333333333333,
        tracks: [
            {
                trackId: 'point-1762476546081',
                x: 0.057534246575342465,
                y: 0.4212962962962963,
            },
        ],
    },
    {
        timestamp: 2.533333333333333,
        tracks: [
            {
                trackId: 'point-1762476550370',
                x: 0.2726027397260274,
                y: 0.4652777777777778,
            },
        ],
    },
    {
        timestamp: 3.1666666666666665,
        tracks: [
            {
                trackId: 'point-1762476552793',
                x: 0.5575342465753425,
                y: 0.4722222222222222,
            },
        ],
    },
    {
        timestamp: 4.033333333333333,
        tracks: [
            {
                trackId: 'point-1762476555749',
                x: 0.6041095890410959,
                y: 0.46064814814814814,
            },
        ],
    },
    {
        timestamp: 5.1,
        tracks: [
            {
                trackId: 'point-1762476558912',
                x: 0.5589041095890411,
                y: 0.4351851851851852,
            },
        ],
    },
    {
        timestamp: 6,
        tracks: [
            {
                trackId: 'point-1762476561836',
                x: 0.5972602739726027,
                y: 0.42824074074074076,
            },
        ],
    },
    {
        timestamp: 6.866666666666666,
        tracks: [
            {
                trackId: 'point-1762476565035',
                x: 0.6397260273972603,
                y: 0.42592592592592593,
            },
        ],
    },
    {
        timestamp: 7.833333333333333,
        tracks: [
            {
                trackId: 'point-1762476568075',
                x: 0.647945205479452,
                y: 0.5254629629629629,
            },
        ],
    },
    {
        timestamp: 8.8,
        tracks: [
            {
                trackId: 'point-1762476570867',
                x: 0.5438356164383562,
                y: 0.7476851851851852,
            },
        ],
    },
    {
        timestamp: 9.7,
        tracks: [
            {
                trackId: 'point-1762476573700',
                x: 0.4041095890410959,
                y: 0.5,
            },
        ],
    },
];

export const mclarenTrack: VideoTrackingPoints = {
    label: 'car',
    alt: 'First person entering from the left',
    type: 'track-points',
    frameList: mclaren,
};
