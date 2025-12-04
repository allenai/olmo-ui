import { Stack } from '@mui/material';
import { PropsWithChildren, ReactNode } from 'react';

import { filesMatchingTypesAllowed } from '../FileUploadButton/fileTypeHelpers';
import { Thumbnail } from './Thumbnail';
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
                paddingBlockStart: 1,
            }}>
            {children}
        </Stack>
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

interface ThumbnailDisplayProps {
    urls?: string[];
    mediaType: string;
}

export const FileThumbnails = ({ urls, mediaType }: ThumbnailDisplayProps): ReactNode => {
    if (urls == null || urls.length === 0) {
        return null;
    }

    const files: { mediaType: string; name: string; src: string }[] = urls.map((u) => ({
        mediaType,
        src: u,
        name: 'hello',
    }));

    return (
        <ThumbnailContainer>
            {files.map((file, i) => (
                <Thumbnail key={i} type={file.mediaType} filename={file.name} src={file.src} />
            ))}
        </ThumbnailContainer>
    );
};
