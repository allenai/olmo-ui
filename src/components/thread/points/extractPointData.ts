interface Point {
    x: number;
    y: number;
}

export interface PointsData {
    points: Point[];
    alt: string;
}

export function extractPointData(input: string): PointsData[] {
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
            const { coordinateIndex } =
                /x(?<coordinateIndex>\d+)/.exec(xAttributeName)?.groups ?? {};

            return {
                x: Number(element.getAttribute(xAttributeName)),
                y: Number(element.getAttribute('y' + coordinateIndex)),
            };
        });

        return {
            points: coordinatePairs,
            alt: element.getAttribute('alt') ?? '',
        } satisfies PointsData;
    });

    return points;
}

window.extractPointData = extractPointData;

// export function extractAllPointsData(input: string): PointsData[] {
//     const allMatches = Array.from(input.matchAll(pointsPattern))
//         .concat(Array.from(input.matchAll(pointPattern)))
//         .sort((a, b) => a.index - b.index);

//     return allMatches.map((match) => {
//         if (match[0].startsWith('<points')) {
//             // Handle <points> tag
//             const pointsString = match[0];
//             const alt = match[2];

//             const points: Point[] = [];
//             let coordinateMatch;
//             while ((coordinateMatch = coordinatePattern.exec(pointsString)) !== null) {
//                 points.push({
//                     x: parseFloat(coordinateMatch[2]),
//                     y: parseFloat(coordinateMatch[3]),
//                 });
//             }

//             return { points, alt };
//         } else {
//             // Handle <point> tag
//             return {
//                 points: [{ x: parseFloat(match[1]), y: parseFloat(match[2]) }],
//                 alt: match[3],
//             };
//         }
//     });
// }
