import {
    DetailedHTMLProps,
    ForwardedRef,
    forwardRef,
    InputHTMLAttributes,
    useImperativeHandle,
    useRef,
} from 'react';
import { Focusable, Key, MenuTrigger } from 'react-aria-components';

import { StyledTooltip } from '@/components/StyledTooltip';
import { useFeatureToggles } from '@/FeatureToggleContext';

import { FileUploadInput } from './FileUploadInput';
import { MediaTypes } from './fileUploadMediaConsts';
import { FileUploadMenu } from './FileUploadMenu';
import { FileUploadTriggerButton } from './FileUploadTriggerButton';
import { useFileInputTrigger } from './useFileInputTrigger';

export interface FileuploadPropsBase {
    isFileUploadDisabled: boolean;
    isSendingPrompt: boolean;
    acceptsFileUpload: boolean;
    acceptedFileTypes: string | string[] | Set<string>;
    acceptsMultiple: boolean;
    allowFilesInFollowups: boolean;
    maxFilesPerMessage?: number;
}

export type FileUploadButtonProps = FileuploadPropsBase &
    Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'type'>;

export const FileUploadButton = forwardRef(function FileUploadButton(
    {
        isFileUploadDisabled,
        isSendingPrompt,
        acceptsFileUpload,
        acceptedFileTypes,
        acceptsMultiple,
        allowFilesInFollowups,
        maxFilesPerMessage,
        ...props
    }: FileUploadButtonProps,
    ref: ForwardedRef<HTMLInputElement>
) {
    const inputRef = useRef<HTMLInputElement>(null);
    const { isMultiModalEnabled } = useFeatureToggles();

    // Assign the value of ref to the inputRef, to be able to use them both.
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const { triggerFileInput } = useFileInputTrigger({ inputRef, maxFilesPerMessage });

    const supportFileUpload = isMultiModalEnabled && acceptsFileUpload;

    const acceptedFileTypesArray =
        typeof acceptedFileTypes === 'string' ? [acceptedFileTypes] : Array.from(acceptedFileTypes);
    const acceptedFileTypesString = acceptedFileTypesArray.join(',');

    if (!supportFileUpload) {
        return null;
    }

    const mediaTypes = Object.entries(MediaTypes).filter(([mediaType]) =>
        acceptedFileTypesArray.some((acceptedType) => acceptedType.startsWith(mediaType))
    );

    const handleMenuAction = (mediaType: Key) => {
        triggerFileInput(mediaType);
    };

    const handleSingleTypeClick = () => {
        if (mediaTypes.length === 1) {
            const [mediaType] = mediaTypes[0];
            triggerFileInput(mediaType);
        }
    };

    const isButtonDisabled = isFileUploadDisabled && !allowFilesInFollowups;
    const isInputDisabled = isSendingPrompt || isFileUploadDisabled;

    let tooltipContent: string | undefined;

    if (isButtonDisabled && !acceptsMultiple) {
        tooltipContent =
            'This model only supports one image on initial message. Start a new chat to submit a new file.';
    } else if (isButtonDisabled && acceptsMultiple) {
        tooltipContent =
            'This model only supports files on initial message. Start a new chat to submit new files.';
    }

    const fileUploadButton = (
        <FileUploadTriggerButton
            isDisabled={isInputDisabled}
            onPress={mediaTypes.length === 1 ? handleSingleTypeClick : undefined}>
            <FileUploadInput
                {...props}
                acceptedFileTypesString={acceptedFileTypesString}
                isDisabled={isInputDisabled}
                acceptsMultiple={acceptsMultiple}
                ref={inputRef}
            />
        </FileUploadTriggerButton>
    );

    // Single file type is only the button
    if (mediaTypes.length === 1) {
        return (
            <StyledTooltip isDisabled={!tooltipContent} content={tooltipContent} placement="top">
                <Focusable isDisabled={!isButtonDisabled}>
                    <span>{fileUploadButton}</span>
                </Focusable>
            </StyledTooltip>
        );
    }

    // Multiple files types has a menu
    return (
        <StyledTooltip isDisabled={!tooltipContent} content={tooltipContent} placement="top">
            <Focusable isDisabled={!isButtonDisabled}>
                <span>
                    <MenuTrigger>
                        {fileUploadButton}
                        <FileUploadMenu mediaTypes={mediaTypes} onAction={handleMenuAction} />
                    </MenuTrigger>
                </span>
            </Focusable>
        </StyledTooltip>
    );
});
