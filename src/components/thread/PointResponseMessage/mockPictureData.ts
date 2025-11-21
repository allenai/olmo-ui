import { ComponentProps } from 'react';

import { PointPictureList } from './PointPictureList';
import { PointPictureSlider } from './PointPictureSlider';

const makeFiveMockPoints = (startCount: number = 1) => [
    {
        pointId: `${startCount}`,
        x: 7.3,
        y: 16,
    },
    {
        pointId: `${startCount + 1}`,
        x: 17.3,
        y: 60,
    },
    {
        pointId: `${startCount + 2}`,
        x: 25.8,
        y: 72.5,
    },
    {
        pointId: `${startCount + 3}`,
        x: 32.3,
        y: 73.5,
    },
    {
        pointId: `${startCount + 4}`,
        x: 35.3,
        y: 16,
    },
];

export const mockSliderProps: ComponentProps<typeof PointPictureSlider> = {
    imagePointsSets: [
        {
            type: 'image-points',
            label: 'the points',
            imageList: [
                {
                    imageId: '1',
                    points: makeFiveMockPoints(1),
                },
                {
                    imageId: '2',
                    points: makeFiveMockPoints(6),
                },
                {
                    imageId: '3',
                    points: makeFiveMockPoints(11),
                },
                {
                    imageId: '4',
                    points: makeFiveMockPoints(16),
                },
                {
                    imageId: '5',
                    points: makeFiveMockPoints(21),
                },
            ],
        },
    ],
    fileUrls: [
        'https://placehold.co/600x400',
        'https://placehold.co/1600x900',
        'https://placehold.co/900x1600',
        'https://placehold.co/400x600',
        'https://placehold.co/2000x2000',
    ],
};

export const mockListProps: ComponentProps<typeof PointPictureList> = {
    imagePointsSets: [
        {
            type: 'image-points',
            label: 'the points',
            imageList: [
                {
                    imageId: '1',
                    points: makeFiveMockPoints(1),
                },
                {
                    imageId: '2',
                    points: makeFiveMockPoints(6),
                },
                {
                    imageId: '3',
                    points: makeFiveMockPoints(11),
                },
                {
                    imageId: '4',
                    points: makeFiveMockPoints(16),
                },
                {
                    imageId: '5',
                    points: makeFiveMockPoints(21),
                },
            ],
        },
    ],
    fileUrls: [
        'https://placehold.co/600x400',
        'https://placehold.co/1600x900',
        'https://placehold.co/900x1600',
        'https://placehold.co/400x600',
        'https://placehold.co/2000x2000',
    ],
};
