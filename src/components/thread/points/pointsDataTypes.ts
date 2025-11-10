// --------------------------------------------------
// Points attributes shape from xml parsing
// NOTE: tracks and coords are exclusive
export type PointsAttributes = {
    label: string;
    alt?: string;
    coords?: string;
    tracks?: string;
};

// --------------------------------------------------
// Multi and Single image pointing:
// coords point format: [imageId,[pointId, x, y]] (\t delimited)
//
// <points alt="alt_text" coords="1 193 076 2 226 144">label_text</points> <-- this one deprecated
// <points alt="alt_text" coords="1 1 193 076 2 226 144\t2 3 411 150 4 422 061">label_text</points>
export type Point = {
    pointId: string;
    x: number;
    y: number;
};

type PerImagePoints = {
    imageId: string | undefined; // undefined for single image for single image
    points: Point[];
};

export type ImagePoints = {
    label: string;
    alt?: string;
    type: 'image-points';
    imageList: PerImagePoints[];
};

// --------------------------------------------------
// Video frame pointing:
// coords point format: [timestamp, [pointId, x, y]] (\t delimited)
//
// <points alt="alt_text" coords="0.0 1 193 076 2 226 144\t30.0 3 411 150 4 422 061">label_text</points>
type PerFramePoints = {
    timestamp: number; // prefer number here.
    points: Point[];
};

export type VideoFramePoints = {
    label: string;
    alt?: string;
    type: 'frame-points';
    frameList: PerFramePoints[];
};

// --------------------------------------------------
// Video tracking:
// track point format: [timestamp, [pointId, x, y]] (\t delimited)
//
// <points alt="alt_text" tracks="0.0 1 193 076 2 226 144\t30.0 1 411 150 2 422 061">label_text</points>
type TrackPoint = {
    trackId: string;
    x: number;
    y: number;
};

type PerFrameTrackPoints = {
    timestamp: number;
    tracks: TrackPoint[];
};

export type VideoTrackingPoints = {
    label: string;
    alt?: string;
    type: 'track-points';
    frameList: PerFrameTrackPoints[];
};

export type AllPointsFormats = ImagePoints | VideoFramePoints | VideoTrackingPoints;

export type PointsType = AllPointsFormats['type'];
