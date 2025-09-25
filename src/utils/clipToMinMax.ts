export const clipToMinMax = (val: number | undefined, min: number, max: number) =>
    val !== undefined ? Math.min(Math.max(val, min), max) : undefined;
