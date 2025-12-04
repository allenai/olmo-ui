import mime from 'mime/lite';
import { ReactNode } from 'react';

import { FileThumbnails } from '../QueryForm/FileUploadThumbnails/FileThumbnailDisplay';

interface UserMessageFileWidgetProps {
    fileUrls: string[];
}

export const UserMessageFileWidget = ({ fileUrls }: UserMessageFileWidgetProps): ReactNode => {
    const mimeType = mime.getType(fileUrls[0]);

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

    if (isPending || fileUrls.length === 0) return null;

    // todo here...
    if (fileType === 'image') {
        return <FileThumbnails mediaType="image/" urls={fileUrls} />;
    }
    if (fileType === 'video') {
        return <FileThumbnails mediaType="video" urls={fileUrls} />;
    }

    return null;
};
