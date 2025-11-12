export type Point = {
    pointId: string;
    x: number;
    y: number;
};

type PerImagePoints = {
    imageId: string | undefined; // undefined for single image for single image
    points: Point[];
};

/**
 * Multi and Single image pointing.
 *
 * Coords points format: [imageId,[pointId, x, y]] (tab delimited).
 *
 * Examples:
 * - Deprecated single-image style:
 *   <points alt="alt_text" coords="1 193 076 2 226 144">label_text</points>
 * - Multi-image style:
 *   <points alt="alt_text" coords="1 1 193 076 2 226 144\t2 3 411 150 4 422 061">label_text</points>
 */
export type ImagePoints = {
    label: string;
    alt?: string;
    type: 'image-points';
    imageList: PerImagePoints[];
};

type PerFramePoints = {
    timestamp: number; // prefer number here.
    points: Point[];
};

/**
 * Video frame pointing.
 *
 * Coords points format: [timestamp, [pointId, x, y]] (tab delimited).
 *
 * Example:
 * <points alt="alt_text" coords="0.0 1 193 076 2 226 144\t30.0 3 411 150 4 422 061">label_text</points>
 */
export type VideoFramePoints = {
    label: string;
    alt?: string;
    type: 'frame-points';
    frameList: PerFramePoints[];
};

export type TrackPoint = {
    trackId: string;
    x: number;
    y: number;
};

export type PerFrameTrackPoints = {
    timestamp: number;
    tracks: TrackPoint[];
};

/**
 * Video tracking.
 *
 * Track points format: [timestamp, [pointId, x, y]] (tab delimited).
 *
 * Example:
 * <points alt="alt_text" tracks="0.0 1 193 076 2 226 144\t30.0 1 411 150 2 422 061">label_text</points>
 */
export type VideoTrackingPoints = {
    label: string;
    alt?: string;
    type: 'track-points';
    frameList: PerFrameTrackPoints[];
};

export type AllPointsFormats = ImagePoints | VideoFramePoints | VideoTrackingPoints;

export type PointsType = AllPointsFormats['type'];
