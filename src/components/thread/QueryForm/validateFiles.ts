import { type ValidateResult } from 'react-hook-form-mui';

import { formatFileSize } from '@/utils/formatFileSize';
import { pluralize } from '@/utils/pluralize';

import { fileTypesToArray, typeMatchesAllowedTypes } from './FileUploadButton/fileTypeHelpers';
import { mediaTypeList } from './FileUploadButton/fileUploadMediaConsts';

interface ValidateFilesOptions {
    acceptedFileTypes: string | string[] | Set<string>;
    maxFilesPerMessage?: number;
    canMixFileTypes: boolean;
    maxTotalFileSize: number;
}

const matchesMediaTypeId = (file: File, acceptedFileTypes: string[]): string | false => {
    for (const mediaConfig of mediaTypeList) {
        // check if this config is in our accepted type list from model config
        const isMediaTypeAccepted = typeMatchesAllowedTypes(mediaConfig.accept, acceptedFileTypes);

        if (isMediaTypeAccepted) {
            // return the type mediaConfig id if its valid;
            if (typeMatchesAllowedTypes(file.type, mediaConfig.accept)) {
                return mediaConfig.id;
            }
        }
    }
    return false;
};

export const validateFiles = (
    fileList: FileList | undefined | null,
    options: ValidateFilesOptions
): ValidateResult => {
    // this is currently validated on the API
    if (!fileList || fileList.length === 0) {
        return true;
    }

    const acceptedFileTypes = fileTypesToArray(options.acceptedFileTypes);

    const filesByMediaType = new Map<string, File[]>();

    const disallowedFileTypes: string[] = [];

    for (const file of fileList) {
        const mediaTypeId = matchesMediaTypeId(file, acceptedFileTypes);
        if (mediaTypeId) {
            const existingFiles = filesByMediaType.get(mediaTypeId);
            // add file to accepted mimetype list
            if (existingFiles) {
                existingFiles.push(file);
            } else {
                filesByMediaType.set(mediaTypeId, [file]);
            }
        } else {
            disallowedFileTypes.push(file.type);
        }
    }

    if (disallowedFileTypes.length) {
        return `Unsupported file ${pluralize(disallowedFileTypes.length, 'type')} ${disallowedFileTypes.join(',')}.`;
    }

    // error if not allowed to mix different mimeType
    if (filesByMediaType.size > 1 && !options.canMixFileTypes) {
        return `Only one of "${acceptedFileTypes.join(', ')}" allowed in a single message.`;
    }

    // check aginst mediaTypeList (mimeType configs, which currently includes hard coded values, but should come from config)
    for (const [mediaTypeId, files] of filesByMediaType) {
        const mediaConfig = mediaTypeList.find((mediaType) => mediaType.id === mediaTypeId);

        const maxFiles = mediaConfig?.maxFiles ?? options.maxFilesPerMessage;

        // check if exceeds maximum for mimeType
        if (maxFiles !== undefined && files.length > maxFiles) {
            const label = `${mediaConfig?.label}${maxFiles > 1 ? 's' : ''}`;
            return `Maximum ${maxFiles} ${label} allowed.`;
        }
    }

    // last validate file sizes as well
    const allFiles = Array.from(filesByMediaType.values()).flat();
    const totalFileSize = allFiles.map((f) => f.size).reduce((a, c) => a + c, 0);

    if (totalFileSize > options.maxTotalFileSize) {
        return `Size of ${pluralize(allFiles.length, 'file')} (${formatFileSize(totalFileSize)}) exceeds maximum of ${formatFileSize(options.maxTotalFileSize)}`;
    }

    return true;
};
