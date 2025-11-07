export type Point = {
    objectId: string; // either a counter or an ID, depending on the input?
    x: number;
    y: number;
};

type SingleImagePoints = {
    imageId: string;
    altText?: string;
    label: string;
    points: Point[];
};

type MultipleImagePoints = {
    imagePoints: SingleImagePoints[];
};

export type VideoFramePoints = {
    frameTimestamp: number; // prefer number here.
    points: Point[];
};

type VideoPoints = {
    framePoints: VideoFramePoints[];
};

export type VideoTrackingObject = {
    objectId: string;
    label: string;
    altText?: string;
    framePoints: VideoFramePoints[];
};

export type VideoTrackingPoints = {
    // It seems like it'd be nice to track objects separately? Could help us mark the indicators differently
    objects: VideoTrackingObject[];
};

// Example: Counting people in a video
export const videoCountingExample: VideoTrackingPoints = {
    objects: [
        {
            objectId: 'person-1',
            label: 'Person',
            altText: 'First person entering from the left',
            framePoints: [
                {
                    frameTimestamp: 0.0,
                    points: [{ objectId: 'person-1', x: 0.2, y: 0.5 }],
                },
                {
                    frameTimestamp: 1.0,
                    points: [{ objectId: 'person-1', x: 0.3, y: 0.5 }],
                },
                {
                    frameTimestamp: 2.0,
                    points: [{ objectId: 'person-1', x: 0.4, y: 0.5 }],
                },
            ],
        },
        {
            objectId: 'person-2',
            label: 'Person',
            altText: 'Second person entering from the right',
            framePoints: [
                {
                    frameTimestamp: 1.0,
                    points: [{ objectId: 'person-2', x: 0.8, y: 0.6 }],
                },
                {
                    frameTimestamp: 2.0,
                    points: [{ objectId: 'person-2', x: 0.7, y: 0.6 }],
                },
                {
                    frameTimestamp: 3.0,
                    points: [{ objectId: 'person-2', x: 0.6, y: 0.6 }],
                },
            ],
        },
        {
            objectId: 'person-3',
            label: 'Person',
            altText: 'Third person walking through the center',
            framePoints: [
                {
                    frameTimestamp: 2.0,
                    points: [{ objectId: 'person-3', x: 0.5, y: 0.4 }],
                },
                {
                    frameTimestamp: 3.0,
                    points: [{ objectId: 'person-3', x: 0.5, y: 0.5 }],
                },
                {
                    frameTimestamp: 4.0,
                    points: [{ objectId: 'person-3', x: 0.5, y: 0.6 }],
                },
            ],
        },
    ],
};

// Helper function to count objects at a specific timestamp
export function countObjectsAtTimestamp(tracking: VideoTrackingPoints, timestamp: number): number {
    return tracking.objects.filter((obj) =>
        obj.framePoints.some((fp) => fp.frameTimestamp === timestamp)
    ).length;
}

// Helper function to get total unique objects tracked
export function getTotalObjectCount(tracking: VideoTrackingPoints): number {
    return tracking.objects.length;
}
export const mclaren = [
    {
        frameTimestamp: 1.8333333333333333,
        points: [
            {
                objectId: 'point-1762476546081',
                x: 0.057534246575342465,
                y: 0.4212962962962963,
            },
        ],
    },
    {
        frameTimestamp: 2.533333333333333,
        points: [
            {
                objectId: 'point-1762476550370',
                x: 0.2726027397260274,
                y: 0.4652777777777778,
            },
        ],
    },
    {
        frameTimestamp: 3.1666666666666665,
        points: [
            {
                objectId: 'point-1762476552793',
                x: 0.5575342465753425,
                y: 0.4722222222222222,
            },
        ],
    },
    {
        frameTimestamp: 4.033333333333333,
        points: [
            {
                objectId: 'point-1762476555749',
                x: 0.6041095890410959,
                y: 0.46064814814814814,
            },
        ],
    },
    {
        frameTimestamp: 5.1,
        points: [
            {
                objectId: 'point-1762476558912',
                x: 0.5589041095890411,
                y: 0.4351851851851852,
            },
        ],
    },
    {
        frameTimestamp: 6,
        points: [
            {
                objectId: 'point-1762476561836',
                x: 0.5972602739726027,
                y: 0.42824074074074076,
            },
        ],
    },
    {
        frameTimestamp: 6.866666666666666,
        points: [
            {
                objectId: 'point-1762476565035',
                x: 0.6397260273972603,
                y: 0.42592592592592593,
            },
        ],
    },
    {
        frameTimestamp: 7.833333333333333,
        points: [
            {
                objectId: 'point-1762476568075',
                x: 0.647945205479452,
                y: 0.5254629629629629,
            },
        ],
    },
    {
        frameTimestamp: 8.8,
        points: [
            {
                objectId: 'point-1762476570867',
                x: 0.5438356164383562,
                y: 0.7476851851851852,
            },
        ],
    },
    {
        frameTimestamp: 9.7,
        points: [
            {
                objectId: 'point-1762476573700',
                x: 0.4041095890410959,
                y: 0.5,
            },
        ],
    },
];

export const mclarenTrack = {
    objects: [
        {
            objectId: 'car',
            label: 'Car',
            altText: 'First person entering from the left',
            framePoints: mclaren,
        },
    ],
};
