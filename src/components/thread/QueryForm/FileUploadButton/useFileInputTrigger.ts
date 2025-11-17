import { RefObject, useCallback } from 'react';
import { Key } from 'react-aria-components';

import { MediaTypes, typeIsMediaType } from './fileUploadMediaConsts';

interface UseFileInputTriggerParams {
    inputRef: RefObject<HTMLInputElement>;
    maxFilesPerMessage?: number;
}

export const useFileInputTrigger = ({
    inputRef,
    maxFilesPerMessage,
}: UseFileInputTriggerParams) => {
    const triggerFileInput = useCallback(
        (mediaType: string | Key) => {
            if (!inputRef.current || !typeIsMediaType(mediaType)) return;

            const mediaConf = MediaTypes[mediaType];
            const maxFiles = mediaConf.maxFiles ?? maxFilesPerMessage;

            inputRef.current.accept = mediaConf.accept;
            inputRef.current.multiple = typeof maxFiles === 'number' && maxFiles > 1;
            inputRef.current.click();
        },
        [inputRef, maxFilesPerMessage]
    );

    return { triggerFileInput };
};
