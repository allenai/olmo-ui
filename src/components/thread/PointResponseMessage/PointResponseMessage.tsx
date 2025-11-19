import { Box, Stack } from '@mui/material';
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
import { ImagePoints } from '../points/pointsDataTypes';
import { pointsRegex } from '../points/pointsRegex';
import {
    MAX_THREAD_IMAGE_HEIGHT_PX,
    MIN_THREAD_IMAGE_HEIGHT_PX,
} from '../ThreadDisplay/threadDisplayConsts';
import { PointPicture, PointsSets } from './PointPicture';
import { PointPictureCaption, PointPictureListCaption } from './PointPictureCaption';
import { PointPictureModal } from './PointPictureModal';

export const PointResponseMessage = ({ messageId }: MessageProps): ReactNode => {
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const handleToggleLightbox = () => {
        setIsModalOpen((prev) => !prev);
    };

    // NOTE: this assumes all points from a response will be a homogenious type
    if (pointsSets?.[0].type === 'image-points') {
        return (
            <>
                <PointPictureList
                    imagePointsSets={pointsSets.filter((set) => set.type === 'image-points')}
                    fileUrls={currentFilesInThread}
                    content={content}
                    onClick={handleToggleLightbox}
                />
                <PointPictureModal open={isModalOpen} closeModal={handleToggleLightbox}>
                    <PointPictureList
                        imagePointsSets={pointsSets.filter((set) => set.type === 'image-points')}
                        fileUrls={currentFilesInThread}
                        content={content}
                        showPerImageCaption={true}
                    />
                </PointPictureModal>
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

const PointPictureList = ({
    imagePointsSets,
    fileUrls,
    content,
    showPerImageCaption,
    onClick,
}: {
    imagePointsSets: ImagePoints[];
    fileUrls: readonly string[];
    content: string;
    showPerImageCaption?: boolean;
    onClick?: () => void;
}) => {
    const markdownContent = content.replaceAll(pointsRegex, '**$<text>**');
    const pointsSetsByFileUrl = fileUrls.reduce<Map<string, PointsSets[]>>((acc, url, index) => {
        imagePointsSets.forEach(({ label, alt, imageList }) => {
            const pointsPerImageId = imageList.find(
                ({ imageId }) => imageId === `${index + 1}`
            )?.points;

            const prev = acc.get(url) || [];

            if (pointsPerImageId) {
                acc.set(url, [
                    ...prev,
                    {
                        label,
                        alt,
                        url,
                        points: pointsPerImageId,
                    },
                ]);
            }
        });

        return acc;
    }, new Map());

    const isSingleImageList = fileUrls.length === 1;

    return (
        <Stack spacing={1}>
            <Box
                component="ul"
                onClick={onClick}
                sx={{
                    display: 'grid',
                    gridAutoFlow: 'column',
                    gridAutoColumns: 'auto',
                    gridTemplateRows: !isSingleImageList ? '200px' : 'auto',
                    gap: 1.5,
                    // minHeight: MIN_THREAD_IMAGE_HEIGHT_PX,
                    maxHeight: MAX_THREAD_IMAGE_HEIGHT_PX,
                    overflowX: !isSingleImageList ? 'auto' : undefined,
                    scrollSnapType: 'x mandatory',
                }}>
                {fileUrls.map((url) => {
                    const pointsSets = pointsSetsByFileUrl.get(url) || [];
                    return (
                        <PointPicture
                            key={url}
                            imageLink={url}
                            pointsSets={pointsSets}
                            caption={
                                showPerImageCaption && (
                                    <PointPictureCaption pointsSets={pointsSets} />
                                )
                            }
                        />
                    );
                })}
            </Box>
            <PointPictureListCaption pointsSets={imagePointsSets} />
            <MarkdownRenderer>{markdownContent}</MarkdownRenderer>
        </Stack>
    );
};
