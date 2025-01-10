import { styled } from '@mui/material';
import { DetailedHTMLProps, ForwardedRef, forwardRef, InputHTMLAttributes, useRef } from 'react';
import { useButton } from 'react-aria';

export const FileUploadButton = forwardRef(function FileUploadButton(
    props: Omit<
        DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
        'type' | 'ref'
    >,
    ref: ForwardedRef<HTMLInputElement>
) {
    const labelRef = useRef<HTMLLabelElement>(null);
    const { buttonProps } = useButton(
        { 'aria-label': 'Upload file', elementType: 'label' },
        labelRef
    );

    return (
        <Label {...buttonProps} ref={labelRef} aria-label="Upload file">
            Upload
            <Input {...props} type="file" ref={ref} />
        </Label>
    );
});

const Label = styled('label')({
    cursor: 'pointer',
});

const Input = styled('input')({
    opacity: 0,
    position: 'absolute',
    zIndex: -1,
});
