import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import { styled } from '@mui/material';
import { DetailedHTMLProps, ForwardedRef, forwardRef, InputHTMLAttributes, useRef } from 'react';

export const FileUploadButton = forwardRef(function FileUploadButton(
    props: Omit<
        DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
        'type' | 'ref'
    >,
    ref: ForwardedRef<HTMLInputElement>
) {
    const labelRef = useRef<HTMLLabelElement>(null);
    return (
        <Label ref={labelRef} aria-label="Upload file">
            <AddAPhotoOutlinedIcon />
            <Input {...props} type="file" ref={ref} />
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
