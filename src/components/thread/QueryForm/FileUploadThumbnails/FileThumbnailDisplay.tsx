import { Box, Stack, styled } from '@mui/material';
import { PropsWithChildren, ReactNode } from 'react';
import { Button } from 'react-aria-components';

import CloseIcon from '@/components/assets/close.svg?react';

import { useObjectUrls } from './useObjectUrls';

const ThumbnailContainer = ({ children }: PropsWithChildren): ReactNode => {
    return (
        <Stack gap={2} direction="row" flexWrap="wrap">
            {children}
        </Stack>
    );
};

const ThumbnailImage = styled('img')({
    objectFit: 'contain',
    maxWidth: 200,
    maxHeight: 200,
});

const RemoveButton = styled(Button)({
    position: 'absolute',
    zIndex: 1,
    top: '0.5rem',
    right: '0.5rem',
    padding: 2,

    background: 'transparent',
    border: 'none',
    cursor: 'pointer',

    ':focus-visible': {
        outline: '1px solid',
        borderRadius: 'var(--radii-full, 9999px)',
    },

    svg: {
        color: 'var(--color-green-100)',
        height: 22,
        width: 22,
    },
});

interface ThumbnailProps {
    filename: string;
    src: string;
    onPressRemove: () => void;
}

const Thumbnail = ({ filename, src, onPressRemove }: ThumbnailProps): ReactNode => {
    return (
        <Box position="relative" zIndex={0}>
            <ThumbnailImage alt={`User uploaded file ${filename}`} src={src} title={filename} />
            <RemoveButton onPress={onPressRemove}>
                <CloseIcon />
                {/* <img
                    src={closeIconUrl}
                    alt={`Remove ${filename} from the files to upload`}
                    height={22}
                    width={22}
                /> */}
            </RemoveButton>
        </Box>
    );
};

interface FileThumbnailDisplayProps {
    files?: FileList;
    onRemoveFile: (fileToRemove: File) => void;
}

export const FileUploadThumbnails = ({ files, onRemoveFile }: FileThumbnailDisplayProps) => {
    const getObjectUrl = useObjectUrls();

    if (files == null) {
        return <ThumbnailContainer />;
    }

    const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));

    return (
        <ThumbnailContainer>
            {imageFiles.map((file, i) => (
                <Thumbnail
                    key={i}
                    filename={file.name}
                    src={getObjectUrl(file)}
                    onPressRemove={() => {
                        onRemoveFile(file);
                    }}
                />
            ))}
        </ThumbnailContainer>
    );
};
