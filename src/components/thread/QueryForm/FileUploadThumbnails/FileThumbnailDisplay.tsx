import { Close } from '@mui/icons-material';
import { Box, Stack, styled } from '@mui/material';
import { PropsWithChildren, ReactNode } from 'react';
import { Button } from 'react-aria-components';

import { filesMatchingTypesAllowed } from './filesMatchingTypesAllowed';
import { useObjectUrls } from './useObjectUrls';

const ThumbnailContainer = ({ children }: PropsWithChildren): ReactNode => {
    return (
        <Stack
            gap={2}
            direction="row"
            flexWrap="wrap"
            sx={{
                width: '100%',
                containerType: 'inline-size',
            }}>
            {children}
        </Stack>
    );
};

const ThumbnailImage = styled('img')({
    objectFit: 'contain',
    maxWidth: 'clamp(100px, 30cqw, 200px)',
    maxHeight: 'clamp(100px, 30cqw, 200px)',
});

const RemoveButton = styled(Button)({
    position: 'absolute',
    display: 'flex',
    zIndex: 1,
    top: '0.5rem',
    right: '0.5rem',
    padding: 2,

    background: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 'var(--radii-full, 9999px)',
    aspectRatio: '1',
    border: 'none',
    cursor: 'pointer',

    ':focus-visible': {
        outline: '1px solid',
        borderRadius: 'var(--radii-full, 9999px)',
    },

    svg: {
        // color: 'var(--color-green-100)',
        color: 'white',
        height: 22,
        width: 22,
    },
});

interface ThumbnailProps {
    filename: string;
    type: string;
    src: string;
    onPressRemove: () => void;
}

const Thumbnail = ({ filename, type, src, onPressRemove }: ThumbnailProps): ReactNode => {
    return (
        <Box position="relative" zIndex={0}>
            <ThumbnailImage alt={`User file ${filename}`} src={src} title={filename} />
            <RemoveButton
                onPress={onPressRemove}
                aria-label={`Remove ${filename} from files to upload`}>
                <Close />
            </RemoveButton>
        </Box>
    );
};

interface FileThumbnailDisplayProps {
    files?: FileList;
    onRemoveFile: (fileToRemove: File) => void;
    acceptedFileTypes?: string | string[] | Set<string>;
}

export const FileUploadThumbnails = ({
    files,
    onRemoveFile,
    acceptedFileTypes = [],
}: FileThumbnailDisplayProps): ReactNode => {
    const getObjectUrl = useObjectUrls();

    if (files == null || files.length === 0) {
        return null;
    }

    const fileTypesAsArray =
        typeof acceptedFileTypes === 'string' ? [acceptedFileTypes] : Array.from(acceptedFileTypes);

    const allowedFiles = filesMatchingTypesAllowed(files, fileTypesAsArray);

    return (
        <ThumbnailContainer>
            {allowedFiles.map((file, i) => (
                <Thumbnail
                    key={i}
                    type={file.type}
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
