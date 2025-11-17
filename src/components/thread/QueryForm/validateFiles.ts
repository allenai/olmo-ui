import { MediaTypes } from './FileUploadButton/fileUploadMediaConsts';
import { typeMatchesAllowedTypes } from './FileUploadThumbnails/typeMatchesAllowedTypes';

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

    const filesByMediaType = new Map<string, File[]>();

    for (const file of fileList) {
        for (const [mediaType, mediaConfig] of Object.entries(MediaTypes)) {
            const isMediaTypeAccepted = typeMatchesAllowedTypes(
                mediaConfig.accept,
                options.acceptedFileTypes
            );

            if (isMediaTypeAccepted) {
                if (typeMatchesAllowedTypes(file.type, mediaConfig.accept)) {
                    const existingFiles = filesByMediaType.get(mediaType);
                    if (existingFiles) {
                        existingFiles.push(file);
                    } else {
                        filesByMediaType.set(mediaType, [file]);
                    }
                    break;
                }
            }
        }
    }

    for (const [mediaType, files] of filesByMediaType) {
        const mediaConfig = MediaTypes[mediaType as keyof typeof MediaTypes];

        // Determine the max files allowed for this media type
        const maxFiles = mediaConfig.maxFiles ?? options.maxFilesPerMessage;

        if (maxFiles !== undefined && files.length > maxFiles) {
            return `Maximum ${maxFiles} ${mediaConfig.label}s allowed`;
        }
    }

    return true;
};
