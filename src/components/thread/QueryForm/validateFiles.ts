import { MediaTypes } from './FileUploadButton/fileUploadMediaConsts';

interface ValidateFilesOptions {
    acceptedFileTypes: string | string[] | Set<string>;
    maxFilesPerMessage?: number;
}

export const validateFiles = (
    fileList: FileList | undefined,
    options: ValidateFilesOptions
): string | true => {
    if (!fileList || fileList.length === 0) {
        return true; // No files is valid
    }

    const acceptedFileTypesArray =
        typeof options.acceptedFileTypes === 'string'
            ? [options.acceptedFileTypes]
            : Array.from(options.acceptedFileTypes);

    // Group files by media type
    const filesByMediaType = new Map<string, File[]>();

    for (const file of fileList) {
        // Determine which media type this file belongs to
        for (const [mediaType, mediaConfig] of Object.entries(MediaTypes)) {
            if (acceptedFileTypesArray.some((acceptedType) => acceptedType.startsWith(mediaType))) {
                if (file.type.startsWith(`${mediaType}/`)) {
                    if (!filesByMediaType.has(mediaType)) {
                        filesByMediaType.set(mediaType, []);
                    }
                    filesByMediaType.get(mediaType)!.push(file);
                    break;
                }
            }
        }
    }

    // Validate each media type against its limits
    for (const [mediaType, files] of filesByMediaType) {
        const mediaConfig = MediaTypes[mediaType as keyof typeof MediaTypes];
        if (!mediaConfig) continue;

        // Determine the max files allowed for this media type
        // Priority: MediaTypes.maxFiles > maxFilesPerMessage
        const maxFiles = mediaConfig.maxFiles ?? options.maxFilesPerMessage;

        if (maxFiles !== undefined && files.length > maxFiles) {
            const label = mediaType === 'video' ? 'video' : `${mediaType}s`;
            return `Maximum ${maxFiles} ${label} allowed`;
        }
    }

    return true;
};
