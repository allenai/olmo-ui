export const constrainSize = (
    initialWidth: number,
    intialHeight: number,
    maxWidth?: number,
    maxHeight?: number
) => {
    let width = initialWidth;
    let height = intialHeight;

    if (maxWidth || maxHeight) {
        const aspectRatio = width / height;

        if (maxWidth && width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
        }

        if (maxHeight && height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
        }
    }
    return [width, height];
};
