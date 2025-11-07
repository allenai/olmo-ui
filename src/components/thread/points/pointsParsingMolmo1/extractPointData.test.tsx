import { extractPointData } from './extractPointData';

describe('extractPointData', () => {
    it('should get data for a single point', () => {
        const point =
            'there is text around this <point x="51.2" y="26.4" alt="cat">cat</point> point';

        const result = extractPointData(point);

        expect(result).not.toBeFalsy();
        expect(result).toHaveLength(1);

        // @ts-expect-error - we check that this is truthy above
        const pointData = result[0];
        expect(pointData.points).toHaveLength(1);
        expect.soft(pointData.points[0]).toEqual({
            x: 51.2,
            y: 26.4,
        });
        expect.soft(pointData.alt).toEqual('cat');
    });

    it('should get data for many points', () => {
        const points =
            'there is text around these <points x1="5.5" y1="81.0" x2="9.5" y2="73.5" x3="14.0" y3="78.8" x4="17.9" y4="65.0" x5="22.5" y5="73.5" x6="26.5" y6="85.0" x7="30.5" y7="78.8" x8="34.5" y8="82.0" x9="38.9" y9="90.0" x10="43.5" y10="96.5" x11="47.0" y11="95.5" x12="50.5" y12="68.0" x13="54.5" y13="67.5" x14="58.5" y14="68.0" x15="62.5" y15="94.0" x16="66.5" y16="96.5" x17="70.5" y17="69.5" x18="76.5" y18="96.5" x19="79.5" y19="69.0" x20="83.0" y20="80.0" x21="86.5" y21="81.0" alt="faders.">faders.</points> points';

        const result = extractPointData(points);

        expect(result).not.toBeFalsy();
        expect(result).toHaveLength(1);

        // @ts-expect-error - we check that this is truthy above
        const pointData = result[0];
        expect(pointData.points).toHaveLength(21);
        expect.soft(pointData.points[0]).toEqual({
            x: 5.5,
            y: 81.0,
        });
        expect.soft(pointData.points[20]).toEqual({ x: 86.5, y: 81.0 });
        expect.soft(pointData.alt).toEqual('faders.');
    });

    it('should get data for multiple sets of points', () => {
        const setsOfPoints = `
            there is text around this <point x="51.2" y="26.4" alt="cat">cat</point> point
            there is text around these <points x1="5.5" y1="81.0" x2="9.5" y2="73.5" x3="14.0" y3="78.8" x4="17.9" y4="65.0" x5="22.5" y5="73.5" x6="26.5" y6="85.0" x7="30.5" y7="78.8" x8="34.5" y8="82.0" x9="38.9" y9="90.0" x10="43.5" y10="96.5" x11="47.0" y11="95.5" x12="50.5" y12="68.0" x13="54.5" y13="67.5" x14="58.5" y14="68.0" x15="62.5" y15="94.0" x16="66.5" y16="96.5" x17="70.5" y17="69.5" x18="76.5" y18="96.5" x19="79.5" y19="69.0" x20="83.0" y20="80.0" x21="86.5" y21="81.0" alt="faders.">faders.</points> points
        `;

        const result = extractPointData(setsOfPoints);

        expect(result).not.toBeFalsy();
        expect(result).toHaveLength(2);

        // @ts-expect-error - we check that this is truthy above
        const firstPointData = result[0];
        expect.soft(firstPointData.points).toHaveLength(1);
        expect.soft(firstPointData.points[0]).toEqual({
            x: 51.2,
            y: 26.4,
        });
        expect.soft(firstPointData.alt).toEqual('cat');

        // @ts-expect-error - we check that this is truthy above
        const secondPointData = result[1];
        expect.soft(secondPointData.points).toHaveLength(21);
        expect.soft(secondPointData.points[0]).toEqual({
            x: 5.5,
            y: 81.0,
        });
        expect.soft(secondPointData.points[20]).toEqual({ x: 86.5, y: 81.0 });
        expect.soft(secondPointData.alt).toEqual('faders.');
    });

    it('should return null when given no points', () => {
        const result = extractPointData('<xml></xml>');

        expect(result).toBeNull();
    });

    it('should skip points that have mismatched coordinate pairs', () => {
        const pointsWithMismatchedCoordinatePairs =
            '<points x1="1.0" y1="2.0" x2="3.0" x3="5.0" y3="6.0" alt="mismatched">mismatched</points>';

        const result = extractPointData(pointsWithMismatchedCoordinatePairs);

        expect(result).not.toBeFalsy();
        expect(result).toHaveLength(1);

        // @ts-expect-error - we check that this is truthy above
        const pointData = result[0];
        expect(pointData.points).toHaveLength(2);
        expect.soft(pointData.points[0]).toEqual({
            x: 1.0,
            y: 2.0,
        });
        expect.soft(pointData.points[1]).toEqual({ x: 5.0, y: 6.0 });
        expect.soft(pointData.alt).toEqual('mismatched');
    });

    // TODO: Figure out how to pass invalid XML that gets past the regex
});
