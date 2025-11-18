export const fileTypesToArray = (fileTypes: string | string[] | Set<string>) =>
    typeof fileTypes === 'string' ? [fileTypes] : Array.from(fileTypes);

export const typeMatchesAllowedTypes = (
    fileType: string,
    allowedFileTypes: string | string[] | Set<string>
): boolean => {
    const allowedTypesArray = fileTypesToArray(allowedFileTypes);

    // remove `*` from `type/*`, so that we can prefix match
    const fileTypePrefixes = allowedTypesArray.map((fileType) => fileType.replace(/\*$/, ''));

    return fileTypePrefixes.some((allowedType) => fileType.startsWith(allowedType));
};

export const filesMatchingTypesAllowed = (files: FileList, allowedFileTypes: string[]): File[] => {
    return Array.from(files).filter((file) => typeMatchesAllowedTypes(file.type, allowedFileTypes));
};
