export const fileTypesToArray = (fileTypes: string | string[] | Set<string>) =>
    typeof fileTypes === 'string' ? [fileTypes] : Array.from(fileTypes);

export const mediaTypeMatches = (mediaType: string, mimeType: string) => {
    const genericMimeType = mimeType.replace(/\/\*$/, '');
    return mediaType.startsWith(genericMimeType);
};

export const typeMatchesAllowedTypes = (
    fileType: string,
    allowedFileTypes: string | string[] | Set<string>
): boolean => {
    const allowedTypesArray = fileTypesToArray(allowedFileTypes);
    return allowedTypesArray.some((allowedType) => mediaTypeMatches(fileType, allowedType));
};

export const filesMatchingTypesAllowed = (files: FileList, allowedFileTypes: string[]): File[] => {
    return Array.from(files).filter((file) => typeMatchesAllowedTypes(file.type, allowedFileTypes));
};
