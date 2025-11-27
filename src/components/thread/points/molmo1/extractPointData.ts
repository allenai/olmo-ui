import { ImagePoints, Point } from '../pointsDataTypes';
import { pointRegex } from './pointRegex';

export function extractPointData(input: string): ImagePoints[] | null {
    const pointXmls = input.match(pointRegex);

    if (pointXmls == null || pointXmls.length === 0) {
        return null;
    }

    // we can have multiple points inside of a response, make them valid xml
    const pointXmlsWithWrapper = `<xml>${pointXmls.join('')}</xml>`;

    const xmlDoc = new DOMParser().parseFromString(pointXmlsWithWrapper, 'text/xml');

    // the XML was invalid
    if (xmlDoc.querySelector('parsererror') != null) {
        return null;
    }

    const pointElements = xmlDoc.getElementsByTagName('point');
    const pointsElements = xmlDoc.getElementsByTagName('points');

    const allPointElements = [...pointElements, ...pointsElements];
    const points = allPointElements.map((element) => {
        const xCoordinateAttributeNames = element
            .getAttributeNames()
            .filter((name) => name.startsWith('x'));

        const coordinatePairs = xCoordinateAttributeNames.reduce<Point[]>((acc, xAttributeName) => {
            const { coordinateIndex } = /x(?<coordinateIndex>\d+)/.exec(xAttributeName)?.groups ?? {
                coordinateIndex: '',
            };

            const x = element.getAttribute(xAttributeName);
            const y = element.getAttribute('y' + coordinateIndex);

            // If one of the coordinates is missing, skip it!
            if (x == null || y == null) {
                return acc;
            }

            const count = acc.length + 1;

            acc.push({
                pointId: `${count}`,
                x: Number(x),
                y: Number(y),
            } as Point);

            return acc;
        }, []);

        return {
            label: element.textContent,
            alt: element.getAttribute('alt') ?? undefined,
            type: 'image-points',
            imageList: [
                {
                    imageId: '1',
                    points: coordinatePairs,
                },
            ],
        } satisfies ImagePoints;
    });

    return points;
}
