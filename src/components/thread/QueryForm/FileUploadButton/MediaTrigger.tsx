import { css } from '@allenai/varnish-panda-runtime/css';
import { type RefObject } from 'react';

import { AddMediaButton } from './AddMediaButton';
import { MediaType } from './fileUploadMediaConsts';
import { FileUploadMenu } from './FileUploadMenu';

interface MediaTriggerProps {
    name: string;
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
    name,
    mediaTypes,
    isDisabled,
    triggerFileInput,
    onSelect,
    acceptedFileTypes,
    acceptsMultiple,
}: MediaTriggerProps) => {
    return (
        <>
            <input
                ref={inputRef}
                type="file"
                name={name}
                disabled={isDisabled}
                multiple={acceptsMultiple}
                accept={acceptedFileTypes.join(',')}
                onChange={(event) => {
                    onSelect(event.target.files ?? undefined);
                }}
                className={css({
                    display: 'none',
                })}
            />
            {mediaTypes.length > 1 ? (
                <FileUploadMenu
                    isDisabled={isDisabled}
                    mediaTypes={mediaTypes}
                    triggerFileInput={triggerFileInput}
                />
            ) : (
                <AddMediaButton
                    onPress={() => {
                        triggerFileInput('image');
                    }}
                    isDisabled={isDisabled}
                    aria-label="Select files"
                />
            )}
        </>
    );
};
