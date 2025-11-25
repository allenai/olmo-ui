import { Stack } from '@mui/material';
import { ReactNode, useState } from 'react';

import { useMessage, useThread } from '@/api/playgroundApi/thread';
import { Role } from '@/api/Role';
import { MolmoCountingVideo } from '@/components/video/counting/MolmoCountingVideo';
import { MolmoTrackingVideo } from '@/components/video/tracking/MolmoTrackingVideo';
import { useThreadView } from '@/pages/comparison/ThreadViewContext';

import { type MessageProps, StandardMessage } from '../ChatMessage/ChatMessage';
import { MarkdownRenderer } from '../Markdown/MarkdownRenderer';
import { extractPointData as extractMolmo1PointData } from '../points/molmo1/extractPointData';
import { extractPointsData as extractMolmo2PointsData } from '../points/molmo2/formatPointsData';
import { pointsRegex } from '../points/pointsRegex';
import { MediaLightbox } from './MediaLightbox';
import { PointPictureListCaption } from './PointPictureCaption';
import { PointPictureList } from './PointPictureList';
import { PointPictureSlider } from './PointPictureSlider';

export const PointResponseMessage = ({ messageId }: MessageProps): ReactNode => {
    const [lightboxData, setLightboxData] = useState<number | null>(null);
    const { threadId } = useThreadView();
    const { message } = useMessage(threadId, messageId);
    const { data: currentFilesInThread } = useThread(threadId, (thread) => {
        return thread.messages
            .filter((message) => message.role === Role.User && message.fileUrls?.length)
            .at(-1)?.fileUrls;
    });
    if (!message) {
        return null; // this shouldn't happen
    }
    if (!currentFilesInThread?.length) {
        return <StandardMessage messageId={messageId} />;
    }

    const { content } = message;
    const pointsSets = extractMolmo1PointData(content) ?? extractMolmo2PointsData(content);

    const markdownContent = content.replaceAll(pointsRegex, '**$<text>**');

    const handleLightboxOpen = ({ index }: { index: number }) => {
        setLightboxData(index);
    };
    const handleLightboxClose = () => {
        setLightboxData(null);
    };

    // NOTE: this assumes all points from a response will be a homogenious type
    if (pointsSets?.[0].type === 'image-points') {
        const imagePointsSets = pointsSets.filter((set) => set.type === 'image-points');
        const markdownContent = content.replaceAll(pointsRegex, '**$<text>**');
        return (
            <>
                <Stack spacing={1}>
                    <PointPictureList
                        imagePointsSets={pointsSets.filter((set) => set.type === 'image-points')}
                        fileUrls={currentFilesInThread}
                        onClick={handleLightboxOpen}
                    />
                    <PointPictureListCaption pointsSets={imagePointsSets} />
                    <MarkdownRenderer>{markdownContent}</MarkdownRenderer>
                </Stack>
                <MediaLightbox open={lightboxData !== null} onClose={handleLightboxClose}>
                    {currentFilesInThread.length > 1 ? (
                        <PointPictureSlider
                            imagePointsSets={pointsSets.filter(
                                (set) => set.type === 'image-points'
                            )}
                            fileUrls={currentFilesInThread}
                            showPerImageCaption={true}
                            initialIndex={lightboxData}
                        />
                    ) : (
                        <Stack spacing={1}>
                            <PointPictureList
                                imagePointsSets={pointsSets.filter(
                                    (set) => set.type === 'image-points'
                                )}
                                fileUrls={currentFilesInThread}
                                onClick={handleLightboxOpen}
                            />
                            <PointPictureListCaption pointsSets={imagePointsSets} />
                        </Stack>
                    )}
                </MediaLightbox>
            </>
        );
    } else if (pointsSets?.[0].type === 'track-points') {
        // TODO: this space reserved for video points components
        const pointInfos = pointsSets.filter((set) => set.type === 'track-points')[0];
        const videoUrl = currentFilesInThread[0];

        return (
            <Stack gap={2}>
                <MolmoTrackingVideo videoTrackingPoints={pointInfos} videoUrl={videoUrl} />
                <MarkdownRenderer>{markdownContent}</MarkdownRenderer>
            </Stack>
        );
    } else if (pointsSets?.[0].type === 'frame-points') {
        const pointInfos = pointsSets.filter((set) => set.type === 'frame-points')[0];
        const videoUrl = currentFilesInThread[0];

        return (
            <Stack gap={2}>
                <MolmoCountingVideo videoUrl={videoUrl} videoPoints={pointInfos} />
                <MarkdownRenderer>{markdownContent}</MarkdownRenderer>
            </Stack>
        );
    }

    return <StandardMessage messageId={messageId} />;
};
