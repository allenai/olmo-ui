import type { RefObject } from 'react';
import { FileTrigger } from 'react-aria-components';

import { AddMediaButton } from './AddMediaButton';
import { MediaType } from './fileUploadMediaConsts';
import { FileUploadMenu } from './FileUploadMenu';

interface MediaTriggerProps {
    acceptsMultiple: boolean;
    inputRef: RefObject<HTMLInputElement>;
    onSelect: (files?: FileList) => void;
    triggerFileInput: (mediaType: string | number) => void;
    isDisabled?: boolean;
    mediaTypes: MediaType[];
    acceptedFileTypes: string[];
}

export const MediaTrigger = ({
    inputRef,
    mediaTypes,
    isDisabled,
    triggerFileInput,
    onSelect,
    acceptedFileTypes,
    acceptsMultiple,
}: MediaTriggerProps) => {
    if (mediaTypes.length > 1) {
        return (
            // FileTrigger (which holds the input), has to be a sibling instead of wrap the menu
            // otherwise it will trigger on press and open the file chooser while opening the menu.
            <>
                <FileUploadMenu
                    isDisabled={isDisabled}
                    mediaTypes={mediaTypes}
                    triggerFileInput={triggerFileInput}
                />
                <FileTrigger
                    ref={inputRef}
                    allowsMultiple={acceptsMultiple}
                    acceptedFileTypes={acceptedFileTypes}
                    onSelect={(files) => {
                        onSelect(files ?? undefined);
                    }}
                />
            </>
        );
    }

    return (
        <FileTrigger
            ref={inputRef}
            allowsMultiple={acceptsMultiple}
            acceptedFileTypes={acceptedFileTypes}
            onSelect={(files) => {
                onSelect(files ?? undefined);
            }}>
            <AddMediaButton isDisabled={isDisabled} />
        </FileTrigger>
    );
};
