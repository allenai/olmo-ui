import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import { styled } from '@mui/material';
import { DetailedHTMLProps, ForwardedRef, forwardRef, InputHTMLAttributes, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useAppContext } from '@/AppContext';
import { StyledTooltip } from '@/components/StyledTooltip';
import { RemoteState } from '@/contexts/util';
import { useFeatureToggles } from '@/FeatureToggleContext';

export const FileUploadButton = forwardRef(function FileUploadButton(
    props: Omit<
        DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
        'type' | 'ref'
    >,
    ref: ForwardedRef<HTMLInputElement>
) {
    const labelRef = useRef<HTMLLabelElement>(null);
    const { isMultiModalEnabled } = useFeatureToggles();
    const { acceptsFileUpload, acceptedFileTypes, acceptsMultiple, allowFilesInFollowups } =
        useAppContext(
            useShallow((state) => {
                const values = {
                    acceptsFileUpload: false,
                    acceptedFileTypes: '',
                    requiredFileOption: undefined as string | undefined,
                    acceptsMultiple: false,
                    allowFilesInFollowups: false,
                };

                if (state.selectedModel?.accepts_files) {
                    const selectedModel = state.selectedModel;
                    values.acceptsFileUpload = selectedModel.accepts_files;
                    values.acceptedFileTypes = selectedModel.accepted_file_types.join('');
                    values.acceptsMultiple =
                        selectedModel.max_files_per_message != null &&
                        selectedModel.max_files_per_message > 1;
                    values.requiredFileOption = selectedModel.require_file_to_prompt;
                    values.allowFilesInFollowups = selectedModel.allow_files_in_followups ?? false;
                }

                return values;
            })
        );

    const isSendingPrompt = useAppContext(
        (state) => state.streamPromptState === RemoteState.Loading
    );

    const isFileUploadDisabled = useAppContext(
        (state) => state.selectedThreadMessages.length > 1 && !allowFilesInFollowups
    );

    const supportFileUpload = isMultiModalEnabled && acceptsFileUpload;

    if (!supportFileUpload) {
        return null;
    }

    return (
        <StyledTooltip
            title="This model only supports one image per thread. Start a new chat to submit a new file."
            disableHoverListener={!isFileUploadDisabled}
            disableTouchListener={!isFileUploadDisabled}>
            <Label ref={labelRef} aria-label="Upload file">
                <AddAPhotoOutlinedIcon />
                <Input
                    {...props}
                    disabled={isSendingPrompt || isFileUploadDisabled}
                    accept={acceptedFileTypes}
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
