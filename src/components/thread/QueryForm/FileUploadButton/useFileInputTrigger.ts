import { type RefObject, useCallback } from 'react';

import { mediaTypeList } from './fileUploadMediaConsts';

interface UseFileInputTriggerParams {
    inputRef: RefObject<HTMLInputElement>;
    maxFilesPerMessage?: number;
}

export const useFileInputTrigger = ({
    inputRef,
    maxFilesPerMessage,
}: UseFileInputTriggerParams) => {
    const triggerFileInput = useCallback(
        (mediaType: string | number) => {
            const mediaConf = mediaTypeList.find((media) => media.id === mediaType);

            // no media or inputRef
            if (!inputRef.current || !mediaConf) return;

            const maxFiles = mediaConf.maxFiles ?? maxFilesPerMessage;

            // maybe move this back to component?
            // eslint-disable-next-line react-compiler/react-compiler
            inputRef.current.accept = mediaConf.accept;
            inputRef.current.multiple = typeof maxFiles === 'number' && maxFiles > 1;
            inputRef.current.value = '';
            inputRef.current.click();
        },
        [inputRef, maxFilesPerMessage]
    );

    return { triggerFileInput };
};
