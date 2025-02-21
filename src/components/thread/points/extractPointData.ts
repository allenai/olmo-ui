import { pointRegex } from './pointRegex';

export interface Point {
    x: number;
    y: number;
}

export interface PointInfo {
    points: Point[];
    alt: string;
}

export function extractPointData(input: string): PointInfo[] | null {
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

        const coordinatePairs = xCoordinateAttributeNames.map((xAttributeName) => {
            const { coordinateIndex } = /x(?<coordinateIndex>\d+)/.exec(xAttributeName)?.groups ?? {
                coordinateIndex: '',
            };

            return {
                x: Number(element.getAttribute(xAttributeName)),
                y: Number(element.getAttribute('y' + coordinateIndex)),
            } as Point;
        });

        return {
            points: coordinatePairs,
            alt: element.getAttribute('alt') ?? '',
        } as PointInfo;
    });

    return points;
}
