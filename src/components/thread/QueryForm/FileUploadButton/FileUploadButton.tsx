import {
    DetailedHTMLProps,
    ForwardedRef,
    forwardRef,
    InputHTMLAttributes,
    useImperativeHandle,
    useRef,
} from 'react';
import { FileTrigger, Focusable } from 'react-aria-components';

import { StyledTooltip } from '@/components/StyledTooltip';
import { useFeatureToggles } from '@/FeatureToggleContext';

import { AddMediaButton } from './AddMediaButton';
import { fileTypesToArray, mediaTypeMatches } from './fileTypeHelpers';
import { type MediaType, mediaTypeList } from './fileUploadMediaConsts';
import { FileUploadMenu } from './FileUploadMenu';
import { useFileInputTrigger } from './useFileInputTrigger';

export interface FileuploadPropsBase {
    isFileUploadDisabled: boolean;
    isSendingPrompt: boolean;
    acceptsFileUpload: boolean;
    acceptedFileTypes: string | string[] | Set<string>;
    acceptsMultiple: boolean;
    allowFilesInFollowups: boolean;
    maxFilesPerMessage?: number;
    // not currently used:
    requiredFileOption?: string; // this should be the union: SchemaMultiModalModel['require_file_to_prompt'] =/
}

export type FileUploadButtonProps = FileuploadPropsBase &
    Omit<
        DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
        'type' | 'onSelect'
    >;

export const FileUploadButton = forwardRef(function FileUploadButton(
    {
        isFileUploadDisabled,
        isSendingPrompt,
        acceptsFileUpload,
        acceptedFileTypes,
        acceptsMultiple,
        allowFilesInFollowups: _allowFilesInFollowups,
        maxFilesPerMessage,
        onSelect,
        // ...props
    }: FileUploadButtonProps & { onSelect?: (files: FileList | undefined) => void },
    ref: ForwardedRef<HTMLInputElement>
) {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const { triggerFileInput } = useFileInputTrigger({ inputRef, maxFilesPerMessage });

    const { isMultiModalEnabled } = useFeatureToggles();

    const supportFileUpload = isMultiModalEnabled && acceptsFileUpload;

    if (!supportFileUpload) {
        return null;
    }

    const fileTypes = fileTypesToArray(acceptedFileTypes);

    const mediaTypes = mediaTypeList.filter((mediaType) =>
        fileTypes.some((acceptedType) => mediaTypeMatches(acceptedType, mediaType.accept))
    );

    let tooltipContent: string | undefined;

    if (isFileUploadDisabled && !acceptsMultiple) {
        tooltipContent =
            'This model only supports files on initial message. Start a new chat to submit a new file.';
    } else if (isFileUploadDisabled && acceptsMultiple) {
        tooltipContent =
            'This model only supports files on initial message. Start a new chat to submit new files.';
    }

    return (
        <StyledTooltip isDisabled={!tooltipContent} content={tooltipContent} placement="top">
            <Focusable>
                <span>
                    <FileTrigger
                        ref={inputRef}
                        allowsMultiple={acceptsMultiple}
                        acceptedFileTypes={fileTypes}
                        onSelect={(files) => {
                            onSelect?.(files ?? undefined);
                        }}
                        defaultCamera="environment">
                        <AddMediaComponent
                            isDisabled={isFileUploadDisabled || isSendingPrompt}
                            mediaTypes={mediaTypes}
                            triggerFileInput={triggerFileInput}
                        />
                    </FileTrigger>
                </span>
            </Focusable>
        </StyledTooltip>
    );
});

const AddMediaComponent = ({
    mediaTypes,
    isDisabled,
    triggerFileInput,
}: {
    triggerFileInput: (mediaType: string | number) => void;
    isDisabled?: boolean;
    mediaTypes: MediaType[];
}) => {
    if (mediaTypes.length > 1) {
        return (
            <FileUploadMenu
                isDisabled={isDisabled}
                mediaTypes={mediaTypes}
                triggerFileInput={triggerFileInput}
            />
        );
    }

    return <AddMediaButton isDisabled={isDisabled} />;
};
