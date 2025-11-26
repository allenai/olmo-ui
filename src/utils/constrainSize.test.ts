import { constrainSize } from './constrainSize';

describe('constrainSize', () => {
    it('scales down proportionally', () => {
        expect(constrainSize(300, 300, 160, 200)).toEqual([160, 160]);
        expect(constrainSize(640, 320, 120, 100)).toEqual([120, 60]);
        expect(constrainSize(360, 600, 260, 200)).toEqual([120, 200]);
        expect(constrainSize(280, 400, 260, 250)).toEqual([175, 250]);
    });

    it('handles optional max sizes', () => {
        expect(constrainSize(600, 300, 140, undefined)).toEqual([140, 70]);
        expect(constrainSize(400, 350, 860, undefined)).toEqual([400, 350]);
        expect(constrainSize(400, 500, undefined, 130)).toEqual([104, 130]);
        expect(constrainSize(360, 420, undefined, 140)).toEqual([120, 140]);
    });
});
