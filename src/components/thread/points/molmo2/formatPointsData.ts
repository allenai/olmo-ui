import { ParseResult, PartialXMLStreamParser } from 'partial-xml-stream-parser';
import * as z from 'zod';

import {
    AllPointsFormats,
    ImagePoints,
    Point,
    VideoFramePoints,
    VideoTrackingPoints,
} from '../pointsDataTypes';

const IMAGE_OR_FRAME_DELIMITER = '\t';
const WHITESPACE_DELIMITER = /\s+/;
const TRACKING_TAG = 'tracks';
const POINTING_TAG = 'points';

const PointsAttributesSchema = z.object({
    label: z.string(),
    alt: z.string().optional(),
    coords: z.string().optional(),
    type: z.enum([POINTING_TAG, TRACKING_TAG]),
});

type PointsAttributes = z.infer<typeof PointsAttributesSchema>;

export const parseAsXML = (content: string) => {
    const parser = new PartialXMLStreamParser();
    let result: ParseResult | undefined;

    try {
        result = parser.parseStream(content);
    } catch (e) {
        const message = 'XML parsing error:' + (e as Error).message;
        throw Error(message, { cause: e });
    }

    if (!(result.xml && result.xml.length > 0)) {
        const message = 'XML parsing error: No points parsed';
        throw Error(message);
    }

    const xmlTags: PointsAttributes[] = [];

    result.xml.forEach((item) => {
        if (item?.[TRACKING_TAG]?.['@coords']) {
            // tracks tag
            xmlTags.push(
                PointsAttributesSchema.parse({
                    label: item[TRACKING_TAG]['#text'],
                    alt: item[TRACKING_TAG]['@alt'],
                    coords: item[TRACKING_TAG]['@coords'],
                    type: TRACKING_TAG,
                })
            );
        }
        if (item?.[POINTING_TAG]?.['@coords']) {
            // points tag
            xmlTags.push(
                PointsAttributesSchema.parse({
                    label: item[POINTING_TAG]['#text'],
                    alt: item[POINTING_TAG]['@alt'],
                    coords: item[POINTING_TAG]['@coords'],
                    type: POINTING_TAG,
                })
            );
        }
    });

    if (!xmlTags.length) {
        const message = 'XML parsing error: No points parsed';
        throw Error(message);
    }

    return xmlTags;
};

export const extractPointsData = (content: string): AllPointsFormats[] | null => {
    try {
        const parseResult = parseAsXML(content);

        return parseResult
            .map((res) => formatPointsData(res))
            .filter((i) => typeof i !== 'undefined');
    } catch (e) {
        console.error((e as Error).message);
        return null;
    }
};

export const formatPointsData = (pointsAttributes: PointsAttributes) => {
    if (pointsAttributes.coords && pointsAttributes.type === TRACKING_TAG) {
        const tracksList = pointsAttributes.coords
            .split(IMAGE_OR_FRAME_DELIMITER)
            .map((trackItem) => trackItem.split(WHITESPACE_DELIMITER));
        const formattedPoints = parseCoordsOrTracks(tracksList);
        return {
            label: pointsAttributes.label,
            alt: pointsAttributes.alt,
            type: 'track-points',
            frameList: formattedPoints.map((point) => ({
                timestamp: Number(point.imageOrFrameId),
                tracks: point.points.map(({ pointId, ...xy }) => ({
                    trackId: pointId,
                    ...xy,
                })),
            })),
        } satisfies VideoTrackingPoints;
    }

    if (pointsAttributes.coords && pointsAttributes.type === POINTING_TAG) {
        const coordsList = pointsAttributes.coords.split(IMAGE_OR_FRAME_DELIMITER);
        const imagesOrFramesList = coordsList.map((coordItem) =>
            coordItem.split(WHITESPACE_DELIMITER)
        );
        if (imagesOrFramesList[0][0].includes('.')) {
            const formattedPoints = parseCoordsOrTracks(imagesOrFramesList);
            return {
                label: pointsAttributes.label,
                alt: pointsAttributes.alt,
                type: 'frame-points',
                frameList: formattedPoints.map((fp) => ({
                    timestamp: Number(fp.imageOrFrameId),
                    points: fp.points,
                })),
            } satisfies VideoFramePoints;
        } else {
            const formattedPoints = parseCoordsOrTracks(imagesOrFramesList);
            return {
                label: pointsAttributes.label,
                alt: pointsAttributes.alt,
                type: 'image-points',
                imageList: formattedPoints.map((fp) => ({
                    imageId: fp.imageOrFrameId,
                    points: fp.points,
                })),
            } satisfies ImagePoints;
        }
    }
};

interface CoordsOrTracks {
    imageOrFrameId: string;
    points: Point[];
}

const parseCoordsOrTracks = (imagesOrFramesList: string[][]): CoordsOrTracks[] => {
    return imagesOrFramesList.map((imageOrFramePoints) => {
        let imageOrFrameId: string = '';
        if (imageOrFramePoints.length % 3 === 1) {
            imageOrFrameId = imageOrFramePoints.shift() ?? '';
        } else if (imageOrFramePoints.length % 3 === 0) {
            // single point image format, add a point id
            // NOTE: remove this on confirmation that this "Single Image Format"
            // without a counter/imageId is not being sent.
            imageOrFrameId = '1';
        } else {
            const message = 'Points formatting Error: There is an imbalance of coordinates';
            throw Error(message);
        }

        const formattedPoints: Point[] = [];
        for (let i = 0; i < imageOrFramePoints.length; i = i + 3) {
            formattedPoints.push({
                pointId: imageOrFramePoints[i],
                x: parseInt(imageOrFramePoints[i + 1], 10) / 10,
                y: parseInt(imageOrFramePoints[i + 2], 10) / 10,
            });
        }

        return {
            imageOrFrameId,
            points: formattedPoints,
        };
    });
};
