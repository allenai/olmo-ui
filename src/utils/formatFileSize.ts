const FILE_SIZE_UNITS = ['B', 'kB', 'MB', 'GB', 'TB'] as const;

// from https://stackoverflow.com/a/20732091
export const formatFileSize = (fileSize: number): string => {
    const unitScale =
        fileSize === 0
            ? 0
            : Math.min(Math.floor(Math.log(fileSize) / Math.log(1000)), FILE_SIZE_UNITS.length - 1);

    // find the decimal value of the fileSize in the denominator (scale)
    const scaledFileSize = String(
        // parseFloat will convert 3.00 to 3, but leave the decimals if they are significant
        parseFloat(Number(fileSize / Math.pow(1000, unitScale)).toFixed(2))
    );

    return `${scaledFileSize} ${FILE_SIZE_UNITS[unitScale]}`;
};
