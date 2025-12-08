import {
    DetailedHTMLProps,
    ForwardedRef,
    forwardRef,
    InputHTMLAttributes,
    RefObject,
    useImperativeHandle,
    useRef,
} from 'react';

import { StyledTooltip } from '@/components/StyledTooltip';
import { useFeatureToggles } from '@/FeatureToggleContext';

import { fileTypesToArray, mediaTypeMatches } from './fileTypeHelpers';
import { mediaTypeList } from './fileUploadMediaConsts';
import { MediaTrigger } from './MediaTrigger';
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
    maxTotalFileSize: number;
}

type InheritedInputProps = Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'type' | 'onSelect' | 'value'
>;

export type FileUploadButtonProps = FileuploadPropsBase &
    InheritedInputProps & {
        onSelect?: (files: FileList | undefined) => void;
        name: string;
    };

export const FileUploadButton = forwardRef(function FileUploadButton(
    {
        name,
        isFileUploadDisabled,
        isSendingPrompt,
        acceptsFileUpload,
        acceptedFileTypes,
        acceptsMultiple,
        allowFilesInFollowups: _allowFilesInFollowups,
        maxFilesPerMessage,
        onSelect,
    }: FileUploadButtonProps,
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
            'This model only supports sending files in the first message. Start a new chat to submit a new file.';
    } else if (isFileUploadDisabled && acceptsMultiple) {
        tooltipContent =
            'This model only supports sending files in the first message. Start a new chat to submit new files.';
    }

    return (
        <StyledTooltip
            isDisabled={!tooltipContent}
            wrapChildrenWithFocus={isFileUploadDisabled}
            content={tooltipContent}
            placement="top">
            <MediaTrigger
                inputRef={inputRef}
                name={name}
                acceptsMultiple={acceptsMultiple}
                isDisabled={isFileUploadDisabled || isSendingPrompt}
                mediaTypes={mediaTypes}
                triggerFileInput={triggerFileInput}
                acceptedFileTypes={fileTypes}
                onSelect={(files) => {
                    onSelect?.(files ?? undefined);
                }}
            />
        </StyledTooltip>
    );
});
