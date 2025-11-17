import { styled } from '@mui/material';
import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from 'react';

const StyledInput = styled('input')({
    opacity: 0,
    position: 'absolute',
    zIndex: -1,
});

interface FileUploadInputProps
    extends Omit<
        DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
        'type'
    > {
    acceptedFileTypesString: string;
    isDisabled: boolean;
    acceptsMultiple: boolean;
}

export const FileUploadInput = forwardRef<HTMLInputElement, FileUploadInputProps>(
    function FileUploadInput(
        { acceptedFileTypesString, isDisabled, acceptsMultiple, labelId, ...props },
        ref
    ) {
        return (
            <StyledInput
                {...props}
                disabled={isDisabled}
                accept={acceptedFileTypesString}
                multiple={acceptsMultiple}
                type="file"
                ref={ref}
                data-testid="file-upload-input"
                aria-hidden={true}
            />
        );
    }
);
