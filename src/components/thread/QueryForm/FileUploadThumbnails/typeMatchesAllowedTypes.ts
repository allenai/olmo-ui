export const typeMatchesAllowedTypes = (
    fileType: string,
    allowedFileTypes: string | string[] | Set<string>
): boolean => {
    const allowedTypesArray =
        typeof allowedFileTypes === 'string' ? [allowedFileTypes] : Array.from(allowedFileTypes);

    // remove `*` from `type/*`, so that we can prefix match
    const fileTypePrefixes = allowedTypesArray.map((fileType) => fileType.replace(/\*$/, ''));

    return fileTypePrefixes.some((allowedType) => fileType.startsWith(allowedType));
};

export const filesMatchingTypesAllowed = (files: FileList, allowedFileTypes: string[]): File[] => {
    return Array.from(files).filter((file) => typeMatchesAllowedTypes(file.type, allowedFileTypes));
};
