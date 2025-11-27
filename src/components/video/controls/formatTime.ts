export const formatTime = (frame: number, fps: number, decimalPlaces: number = 0): string => {
    const hours = Math.floor(frame / fps / 3600);
    const hoursStr = hours > 0 ? `${hours}:` : '';

    const totalSeconds = Math.floor(frame / fps);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const remainderFrames = frame % fps;
    const fractionalSeconds = remainderFrames / fps;
    const secondsWithFraction = seconds + fractionalSeconds;

    const padLength = decimalPlaces > 0 ? decimalPlaces + 3 : 2;
    const paddedSeconds = secondsWithFraction.toFixed(decimalPlaces).padStart(padLength, '0');

    return `${hoursStr}${minutes}:${paddedSeconds}`;
};
