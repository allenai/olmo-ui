import { Validate, type ValidateResult } from 'react-hook-form-mui';

import { mediaTypeList } from './FileUploadButton/fileUploadMediaConsts';
import { QueryFormValues } from './QueryFormController';
import { fileTypesToArray, typeMatchesAllowedTypes } from './FileUploadButton/fileTypeHelpers';

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
        for (const mediaConfig of mediaTypeList) {
            const isMediaTypeAccepted = typeMatchesAllowedTypes(
                mediaConfig.accept,
                acceptedFileTypes
            );

            if (isMediaTypeAccepted) {
                if (typeMatchesAllowedTypes(file.type, mediaConfig.accept)) {
                    const existingFiles = filesByMediaType.get(mediaConfig.id);
                    if (existingFiles) {
                        existingFiles.push(file);
                    } else {
                        filesByMediaType.set(mediaConfig.id, [file]);
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

    for (const [mediaTypeId, files] of filesByMediaType) {
        const mediaConfig = mediaTypeList.find((mediaType) => mediaType.id === mediaTypeId)

        const maxFiles = mediaConfig?.maxFiles ?? options.maxFilesPerMessage;

        if (maxFiles !== undefined && files.length > maxFiles) {
            const label = `${mediaConfig?.label}${maxFiles > 1 ? 's' : ''}`;
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
