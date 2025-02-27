import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import { styled } from '@mui/material';
import { DetailedHTMLProps, ForwardedRef, forwardRef, InputHTMLAttributes, useRef } from 'react';

import { useAppContext } from '@/AppContext';
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
    const acceptsFileUpload = useAppContext(
        (state) => state.selectedModel?.accepted_file_types != null
    );
    const acceptedFileTypes = useAppContext(
        (state) => state.selectedModel?.accepted_file_types?.join(',') || ''
    );
    const requiredFileOption = useAppContext(
        (state) => state.selectedModel?.require_file_to_prompt
    );
    const acceptsMultiple = useAppContext(
        (state) =>
            state.selectedModel?.max_files_per_message !== undefined &&
            state.selectedModel.max_files_per_message > 1
    );
    const isSendingPrompt = useAppContext(
        (state) => state.streamPromptState === RemoteState.Loading
    );

    const disableFileUploadAfterSent = useAppContext(
        (state) => state.selectedThreadMessages.length > 1 && requiredFileOption === 'first_message'
    );

    const supportFileUpload = isMultiModalEnabled && acceptsFileUpload;

    if (!supportFileUpload) {
        return null;
    }

    return (
        <Label ref={labelRef} aria-label="Upload file">
            <AddAPhotoOutlinedIcon />
            <Input
                {...props}
                disabled={isSendingPrompt || disableFileUploadAfterSent}
                accept={acceptedFileTypes}
                multiple={acceptsMultiple}
                type="file"
                ref={ref}
                data-testid="file-upload-btn"
            />
        </Label>
    );
});

const Label = styled('label')({
    cursor: 'pointer',
    borderRadius: 'var(--radii-full, 9999px)',
    padding: 'var(--spacing-1)',
    display: 'flex',
    color: 'var(--palette-light-accent-secondary)',

    ':hover': {
        color: 'var(--color-teal-100)',
    },

    ':has(:focus-visible)': {
        outline: '1px solid',
        borderRadius: 'var(--radii-full, 9999px)',
    },

    '@supports not (selector(:focus-visible)) or (selector(:has(*))': {
        outline: '1px solid',
        borderRadius: 'var(--radii-full, 9999px)',
    },
});

const Input = styled('input')({
    opacity: 0,
    position: 'absolute',
    zIndex: -1,
});
