export const clipToMinMax = (val: number, min: number, max: number) =>
    Math.min(Math.max(val, min), max);
