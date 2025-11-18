import { Validate, type ValidateResult } from 'react-hook-form-mui';

import { MediaTypes } from './FileUploadButton/fileUploadMediaConsts';
import {
    fileTypesToArray,
    typeMatchesAllowedTypes,
} from './FileUploadThumbnails/typeMatchesAllowedTypes';
import { QueryFormValues } from './QueryFormController';

interface ValidateFilesOptions {
    acceptedFileTypes: string | string[] | Set<string>;
    maxFilesPerMessage?: number;
    canMixFileTypes: boolean;
}

export const validateFiles = (
    fileList: FileList | undefined,
    options: ValidateFilesOptions
): ValidateResult => {
    // this is currently validated on the API
    if (!fileList || fileList.length === 0) {
        return true;
    }

    const acceptedFileTypes = fileTypesToArray(options.acceptedFileTypes);

    const filesByMediaType = new Map<string, File[]>();

    for (const file of fileList) {
        for (const [mediaType, mediaConfig] of Object.entries(MediaTypes)) {
            const isMediaTypeAccepted = typeMatchesAllowedTypes(
                mediaConfig.accept,
                acceptedFileTypes
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

    // error if not allowed to mix different types
    if (filesByMediaType.size > 1 && !options.canMixFileTypes) {
        return `Errors only one of "${acceptedFileTypes.join(', ')}" allowed in a single message.`;
    }

    for (const [mediaType, files] of filesByMediaType) {
        const mediaConfig = MediaTypes[mediaType as keyof typeof MediaTypes];

        const maxFiles = mediaConfig.maxFiles ?? options.maxFilesPerMessage;

        if (maxFiles !== undefined && files.length > maxFiles) {
            const label = `${mediaConfig.label}${maxFiles > 1 ? 's' : ''}`;
            return `Maximum ${maxFiles} ${label} allowed.`;
        }
    }

    return true;
};

export const createValidateFunction = (
    options: ValidateFilesOptions
): Validate<FileList | undefined, QueryFormValues> => {
    return (files: FileList | undefined) => validateFiles(files, options);
};
