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
