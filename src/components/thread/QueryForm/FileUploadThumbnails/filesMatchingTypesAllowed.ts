export const filesMatchingTypesAllowed = (files: FileList, allowedFileTypes: string[]): File[] => {
    // remove `*` from `type/*`, so that we can prefix match
    const fileTypePrefixes = allowedFileTypes.map((fileType) => fileType.replace(/\*$/, ''));

    return Array.from(files).filter((file) =>
        fileTypePrefixes.some((fileType) => file.type.startsWith(fileType))
    );
};
