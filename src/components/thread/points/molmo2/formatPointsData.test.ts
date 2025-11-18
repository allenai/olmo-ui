import { ImagePoints, VideoFramePoints, VideoTrackingPoints } from '../pointsDataTypes';
import { extractPointsData } from './formatPointsData';

describe('Parse Points', () => {
    it('parse single image points into ImagePoints', () => {
        const singleImagePointsTag = `<points alt="alt_text" coords="1 193 076 2 226 144">label_text</points>`;

        const expected: ImagePoints = {
            label: 'label_text',
            alt: 'alt_text',
            type: 'image-points',
            imageList: [
                {
                    imageId: '1',
                    points: [
                        {
                            pointId: '1',
                            x: 19.3,
                            y: 7.6,
                        },
                        {
                            pointId: '2',
                            x: 22.6,
                            y: 14.4,
                        },
                    ],
                },
            ],
        };

        const result = extractPointsData(singleImagePointsTag);

        expect(result).toStrictEqual(expected);
    });

    it('parse multi image points into ImagePoints', () => {
        const singleImagePointsTag = `
          <points alt="alt_text" coords="1 1 193 076 2 226 144\t2 3 411 150 4 422 061">label_text</points>`;

        const expected: ImagePoints = {
            label: 'label_text',
            alt: 'alt_text',
            type: 'image-points',
            imageList: [
                {
                    imageId: '1',
                    points: [
                        {
                            pointId: '1',
                            x: 19.3,
                            y: 7.6,
                        },
                        {
                            pointId: '2',
                            x: 22.6,
                            y: 14.4,
                        },
                    ],
                },
                {
                    imageId: '2',
                    points: [
                        {
                            pointId: '3',
                            x: 41.1,
                            y: 15,
                        },
                        {
                            pointId: '4',
                            x: 42.2,
                            y: 6.1,
                        },
                    ],
                },
            ],
        };

        const result = extractPointsData(singleImagePointsTag);

        expect(result).toStrictEqual(expected);
    });

    it('parse video frame points into VideoFramePoints', () => {
        const singleImagePointsTag = `
          <points alt="alt_text" coords="0.0 1 193 076 2 226 144\t30.0 3 411 150 4 422 061">label_text</points>`;

        const expected: VideoFramePoints = {
            label: 'label_text',
            alt: 'alt_text',
            type: 'frame-points',
            frameList: [
                {
                    timestamp: 0,
                    points: [
                        {
                            pointId: '1',
                            x: 19.3,
                            y: 7.6,
                        },
                        {
                            pointId: '2',
                            x: 22.6,
                            y: 14.4,
                        },
                    ],
                },
                {
                    timestamp: 30,
                    points: [
                        {
                            pointId: '3',
                            x: 41.1,
                            y: 15,
                        },
                        {
                            pointId: '4',
                            x: 42.2,
                            y: 6.1,
                        },
                    ],
                },
            ],
        };

        const result = extractPointsData(singleImagePointsTag);

        expect(result).toStrictEqual(expected);
    });

    it('parse video tracking points into VideoTrackingPoints', () => {
        const singleImagePointsTag = `
          <tracks alt="alt_text" coords="0.0 1 193 076 2 226 144\t30.0 1 411 150 2 422 061">label_text</tracks>`;

        const expected: VideoTrackingPoints = {
            label: 'label_text',
            alt: 'alt_text',
            type: 'track-points',
            frameList: [
                {
                    timestamp: 0,
                    tracks: [
                        {
                            trackId: '1',
                            x: 19.3,
                            y: 7.6,
                        },
                        {
                            trackId: '2',
                            x: 22.6,
                            y: 14.4,
                        },
                    ],
                },
                {
                    timestamp: 30,
                    tracks: [
                        {
                            trackId: '1',
                            x: 41.1,
                            y: 15,
                        },
                        {
                            trackId: '2',
                            x: 42.2,
                            y: 6.1,
                        },
                    ],
                },
            ],
        };

        const result = extractPointsData(singleImagePointsTag);

        expect(result).toStrictEqual(expected);
    });

    it('parse will return null when coords do not have the proper value format (imbalanced xy pairs)', () => {
        const singleImagePointsTag = `<points alt="alt_text" coords="1 1 193 076 2 226 144 99">label_text</points>`;

        const expected = null;

        const result = extractPointsData(singleImagePointsTag);

        expect(result).toStrictEqual(expected);
    });

    it('parse will return null if both coords and tracks attributes are missing', () => {
        const singleImagePointsTag = `<points alt="alt_text">label_text</points>`;

        const expected = null;

        const result = extractPointsData(singleImagePointsTag);

        expect(result).toStrictEqual(expected);
    });
});
