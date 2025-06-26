import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import { styled } from '@mui/material';
import { DetailedHTMLProps, ForwardedRef, forwardRef, InputHTMLAttributes, useRef } from 'react';

import { StyledTooltip } from '@/components/StyledTooltip';
import { useFeatureToggles } from '@/FeatureToggleContext';

export interface FileuploadPropsBase {
    isFileUploadDisabled: boolean;
    isSendingPrompt: boolean;
    acceptsFileUpload: boolean;
    acceptedFileTypes: string | string[] | Set<string>;
    acceptsMultiple: boolean;
    allowFilesInFollowups: boolean;
}

type FileUploadButtonProps = FileuploadPropsBase &
    Omit<
        DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
        'type' | 'ref'
    >;

export const FileUploadButton = forwardRef(function FileUploadButton(
    {
        isFileUploadDisabled,
        isSendingPrompt,
        acceptsFileUpload,
        acceptedFileTypes,
        acceptsMultiple,
        allowFilesInFollowups,
        ...props
    }: FileUploadButtonProps,
    ref: ForwardedRef<HTMLInputElement>
) {
    const labelRef = useRef<HTMLLabelElement>(null);
    const { isMultiModalEnabled } = useFeatureToggles();

    const supportFileUpload = isMultiModalEnabled && acceptsFileUpload;

    const acceptedFileTypesString =
        typeof acceptedFileTypes === 'string'
            ? acceptedFileTypes
            : [...acceptedFileTypes].join(',');

    if (!supportFileUpload) {
        return null;
    }

    return (
        <StyledTooltip
            title="This model only supports one image per thread. Start a new chat to submit a new file."
            disableFocusListener
            disableHoverListener={!isFileUploadDisabled}
            disableTouchListener={!isFileUploadDisabled}>
            <Label ref={labelRef} aria-label="Upload file">
                <AddAPhotoOutlinedIcon />
                <Input
                    {...props}
                    disabled={isSendingPrompt || isFileUploadDisabled}
                    accept={acceptedFileTypesString}
                    multiple={acceptsMultiple}
                    type="file"
                    ref={ref}
                    data-testid="file-upload-btn"
                />
            </Label>
        </StyledTooltip>
    );
});

const Label = styled('label')(({ theme }) => ({
    cursor: 'pointer',
    borderRadius: 'var(--radii-full, 9999px)',
    padding: 4,
    display: 'flex',
    color: 'var(--palette-light-accent-secondary)',

    ':hover': {
        color: 'var(--color-teal-100)',
    },

    ':has(:focus-visible)': {
        outline: '1px solid',
        borderRadius: 'var(--radii-full, 9999px)',
    },

    ':has(input[type="file"]:disabled)': {
        color: theme.palette.action.disabled,
        ':hover': {
            cursor: 'default',
        },
    },

    '@supports not (selector(:focus-visible) or selector(:has(*)))': {
        outline: '1px solid',
        borderRadius: 'var(--radii-full, 9999px)',
    },
}));

const Input = styled('input')({
    opacity: 0,
    position: 'absolute',
    zIndex: -1,
});
