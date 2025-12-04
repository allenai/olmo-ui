import mime from 'mime/lite';
import { Box } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';

import { FileThumbnails } from '../QueryForm/FileUploadThumbnails/FileThumbnailDisplay';
import { MediaLightbox } from '../PointResponseMessage/MediaLightbox';

interface UserMessageFileWidgetProps {
    fileUrls: string[];
}

export const UserMessageFileWidget = ({ fileUrls }: UserMessageFileWidgetProps): ReactNode => {
    const mimeType = mime.getType(fileUrls[0]);
    const [fileType, setFileType] = useState<FileType | null>(null);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const isPending = fileType === null;

    if (fileUrls.length === 0) return null;

                const headers = response.headers;
                const contentType = headers.get('Content-Type');

                if (contentType?.startsWith('image/')) {
                    setFileType('image');
                } else if (contentType?.startsWith('video/')) {
                    setFileType('video');
                } else {
                    setFileType('file');
                }
            } catch (error) {
                console.error('Error fetching fileUrl headers:', error);
                setFileType('file');
            }
        };

        void determineFileType(fileUrls[0]);
    }, [fileUrls]);

    const handleThumbnailClick = (index: number) => {
        setLightboxIndex(index);
    };

    const handleLightboxClose = () => {
        setLightboxIndex(null);
    };

    if (isPending || fileUrls.length === 0) return null;

    // todo here...
    if (fileType === 'image') {
        return (
            <>
                <FileThumbnails mediaType="image/" urls={fileUrls} onClick={handleThumbnailClick} />
                <MediaLightbox open={lightboxIndex !== null} onClose={handleLightboxClose}>
                    {lightboxIndex !== null && (
                        <Box
                            component="img"
                            src={fileUrls[lightboxIndex]}
                            alt={`Image ${lightboxIndex + 1}`}
                            sx={{
                                maxWidth: '100%',
                                maxHeight: '90vh',
                                objectFit: 'contain',
                            }}
                        />
                    )}
                </MediaLightbox>
            </>
        );
    }
    if (fileType === 'video') {
        return (
            <>
                <FileThumbnails mediaType="video" urls={fileUrls} onClick={handleThumbnailClick} />
                <MediaLightbox open={lightboxIndex !== null} onClose={handleLightboxClose}>
                    {lightboxIndex !== null && (
                        <Box
                            component="video"
                            src={fileUrls[lightboxIndex]}
                            controls
                            sx={{
                                maxWidth: '100%',
                                maxHeight: '90vh',
                            }}
                        />
                    )}
                </MediaLightbox>
            </>
        );
    }

    return null;
};
