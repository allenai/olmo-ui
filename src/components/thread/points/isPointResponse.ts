const pointsPattern =
    /<points\s((?:x\d+="[\d.]+")\s(?:y\d+="[\d.]+")\s?)+alt="([^"]*)">(.*?)<\/points>/g;

const pointPattern = /<point\s+x="([\d.]+)"\s+y="([\d.]+)"\s+alt="([^"]*)">(.*?)<\/point>/g;

export const isPointResponse = (response: string): boolean =>
    pointsPattern.test(response) || pointPattern.test(response);
