interface Point {
    x: number;
    y: number;
}

export interface PointInfo {
    points: Point[];
    alt: string;
}

export function extractPointData(input: string): PointInfo[] {
    const xmlDoc = new DOMParser().parseFromString(input, 'text/xml');

    if (xmlDoc.querySelector('parsererror') != null) {
        throw new Error("Input provided to extractPointData isn't valid XML");
    }

    const pointElements = xmlDoc.getElementsByTagName('point');
    const pointsElements = xmlDoc.getElementsByTagName('points');

    const allPointElements = [...pointElements, ...pointsElements];
    const points = allPointElements.flatMap((element) => {
        const xCoordinateAttributeNames = element
            .getAttributeNames()
            .filter((name) => name.startsWith('x'));

        const coordinatePairs = xCoordinateAttributeNames.map((xAttributeName) => {
            // just an "x" attribute
            if (xAttributeName.length === 1) {
                return {
                    x: Number(element.getAttribute(xAttributeName)),
                    y: Number(element.getAttribute('y')),
                };
            }

            // an "x" attribute with a number after, like "x1" or "x42"
            // TODO: figure out if we need to do some error handling around the empty group
            const { coordinateIndex } =
                /x(?<coordinateIndex>\d+)/.exec(xAttributeName)?.groups ?? {};

            return {
                x: Number(element.getAttribute(xAttributeName)),
                y: Number(element.getAttribute('y' + coordinateIndex)),
            } satisfies Point;
        });

        return {
            points: coordinatePairs,
            alt: element.getAttribute('alt') ?? '',
        } satisfies PointInfo;
    });

    return points;
}
