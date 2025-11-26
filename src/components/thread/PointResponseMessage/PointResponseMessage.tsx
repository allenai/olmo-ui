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
import { pointRegex as regexMolmo1 } from '../points/molmo1/pointRegex';
import { extractPointsData as extractMolmo2PointsData } from '../points/molmo2/formatPointsData';
import { pointsRegex as regexMolmo2 } from '../points/molmo2/pointsRegex';
import { MAX_THREAD_IMAGE_HEIGHT } from '../ThreadDisplay/threadDisplayConsts';
import { PointPicture } from './PointPicture';
import { PointPictureCaption } from './PointPictureCaption';
import { PointPictureModal } from './PointPictureModal';

export const PointResponseMessage = ({ messageId }: MessageProps): ReactNode => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { threadId } = useThreadView();
    const { message } = useMessage(threadId, messageId);
    const { data: lastFilesInThread } = useThread(threadId, (thread) => {
        return thread.messages
            .filter((message) => message.role === Role.User && message.fileUrls?.length)
            .at(-1)?.fileUrls;
    });
    if (!message) {
        return null; // this shouldn't happen
    }
    const { content } = message;

    if (lastFilesInThread == null) {
        return <StandardMessage messageId={messageId} />;
    }

    const pointInfos = extractMolmo1PointData(content) ?? extractMolmo2PointsData(content);

    const markdownContent = pointInfos
        ? Array.isArray(pointInfos)
            ? content.replaceAll(regexMolmo1, '**$<text>**')
            : content.replaceAll(regexMolmo2, '**$<text>**')
        : content;

    const handleClose = () => {
        setIsModalOpen(false);
    };

    if (Array.isArray(pointInfos) || pointInfos?.type === 'image-points') {
        // TODO: Currently only supports single image. Refactor to support multi image.
        const points = Array.isArray(pointInfos)
            ? pointInfos
            : [
                  {
                      alt: pointInfos.alt ?? pointInfos.label,
                      points: pointInfos.imageList[0].points.map(({ x, y }) => ({ x, y })),
                  },
              ];

        return (
            <>
                <Box component="figure" sx={{ margin: 0, marginBlockEnd: 2 }}>
                    <Box
                        onClick={() => {
                            setIsModalOpen(true);
                        }}
                        sx={{
                            display: 'grid',
                            gridTemplate: 'auto / auto',
                            gridTemplateAreas: '"combined"',
                            width: 'fit-content',
                            height: 'fit-content',
                            maxWidth: '100%',
                            '&:hover': {
                                cursor: 'pointer',
                            },
                        }}>
                        <PointPicture
                            imageLink={lastFilesInThread[0]}
                            pointInfos={points}
                            sx={{
                                gridArea: 'combined',
                                maxHeight: MAX_THREAD_IMAGE_HEIGHT,
                                objectFit: 'contain',
                                height: 'auto',
                                maxWidth: '100%',
                            }}
                        />
                    </Box>
                    <PointPictureModal open={isModalOpen} closeModal={handleClose}>
                        <PointPicture
                            imageLink={lastFilesInThread[0]}
                            pointInfos={points}
                            caption={<PointPictureCaption pointInfos={points} />}
                            sx={{ gridArea: 'combined' }}
                        />
                    </PointPictureModal>
                    <PointPictureCaption pointInfos={points} />
                </Box>
                <MarkdownRenderer>{markdownContent}</MarkdownRenderer>
            </>
        );
    } else if (pointInfos?.type) {
        const videoUrl = lastFilesInThread[0];

        if (pointInfos.type === 'track-points') {
            return (
                <Stack gap={2}>
                    <MolmoTrackingVideo videoTrackingPoints={pointInfos} videoUrl={videoUrl} />
                    <MarkdownRenderer>{markdownContent}</MarkdownRenderer>
                </Stack>
            );
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (pointInfos.type === 'frame-points') {
            return (
                <Stack gap={2}>
                    <MolmoCountingVideo videoUrl={videoUrl} videoPoints={pointInfos} />
                    <MarkdownRenderer>{markdownContent}</MarkdownRenderer>
                </Stack>
            );
        }
    }

    return <StandardMessage messageId={messageId} />;
};
