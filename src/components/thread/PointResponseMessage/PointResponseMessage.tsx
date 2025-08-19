import { styled, Typography, useTheme } from '@mui/material';
import { Box, Stack, SxProps, Theme } from '@mui/system';
import React, { ReactNode, useState } from 'react';

import { useMessage, useThread } from '@/api/playgroundApi/thread';
import { Role } from '@/api/Role';
import { useThreadView } from '@/pages/comparison/ThreadViewContext';

import { MarkdownRenderer } from '../Markdown/MarkdownRenderer';
import { extractPointData, Point, PointInfo } from '../points/extractPointData';
import { pointRegex } from '../points/pointRegex';
import { MessageProps, StandardMessage } from '../ThreadDisplay/MessageView';
import { MAX_THREAD_IMAGE_HEIGHT } from '../ThreadDisplay/threadDisplayConsts';
import { PointPictureModal } from './PointPictureModal';

interface PointCircleProps {
    xPercent: number;
    yPercent: number;
    shouldAnimate?: boolean;
}

const PointCircle = ({
    xPercent,
    yPercent,
    shouldAnimate = false,
}: PointCircleProps): ReactNode => {
    return (
        <>
            <circle cx={`${xPercent}%`} cy={`${yPercent}%`} r={5} fill="currentColor" />
            {shouldAnimate && (
                <circle
                    cx={`${xPercent}%`}
                    cy={`${yPercent}%`}
                    fill="none"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="1.5">
                    <animate
                        attributeName="r"
                        from="4"
                        to="8"
                        dur="1.5s"
                        begin="0s"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="opacity"
                        from="1"
                        to="0"
                        dur="1.5s"
                        begin="0s"
                        repeatCount="indefinite"
                    />
                </circle>
            )}
        </>
    );
};

// This is using styled because Box eats the height and width properties that we want to pass to the SVG!
const PointOnImageSvg = styled('svg')({
    gridArea: 'combined',
    height: '100%',
    width: '100%',
    zIndex: 1,
});

interface PointOnImageProps {
    points: Point[];
    fill: string;
}
const PointOnImage = ({ points, fill }: PointOnImageProps): ReactNode => (
    // Height and width are applied here to give it a minimum viewport of 0w,0h. Otherwise it gets set to the default of 300wx150h
    // This allows us to scale down to smaller sizes
    <PointOnImageSvg aria-hidden width="0" height="0" sx={{ color: fill }}>
        {points.map((point, pointIndex) => (
            <PointCircle xPercent={point.x} yPercent={point.y} key={pointIndex} shouldAnimate />
        ))}
    </PointOnImageSvg>
);

// This lets us use sx without using a box
const PointLabelSvg = styled('svg')({});

interface PointLabelProps {
    pointColor: string;
    text: string;
}
const PointLabel = ({ pointColor, text }: PointLabelProps): ReactNode => (
    <Stack gap="0.5ch" useFlexGap direction="row" alignItems="center">
        <PointLabelSvg
            viewBox="0 0 20 20"
            height="1em"
            width="1em"
            aria-hidden
            sx={{ color: pointColor }}>
            <PointCircle xPercent={50} yPercent={50} />
        </PointLabelSvg>
        <Typography>{text}</Typography>
    </Stack>
);

const PointPicture = ({
    imageLink,
    pointInfos,
    pointColors,
    caption,
    sx,
}: {
    imageLink: string;
    pointInfos: PointInfo[];
    pointColors: string[];
    caption?: React.ReactNode;
    sx?: SxProps<Theme>;
}) => {
    return (
        <>
            <Box component="img" src={imageLink} alt="" sx={sx} />
            {pointInfos.map((pointInfo, i) => {
                return (
                    <PointOnImage
                        key={i}
                        points={pointInfo.points}
                        fill={pointColors[i % pointColors.length]}
                    />
                );
            })}
            {caption}
        </>
    );
};

const PointPictureCaption = ({
    pointInfos,
    pointColors,
}: {
    pointInfos: PointInfo[];
    pointColors: string[];
}) => {
    return (
        <Stack gap={1} useFlexGap component="figcaption" sx={{ marginBlockStart: 1 }}>
            {pointInfos.map((pointInfo, i) => (
                <PointLabel
                    key={i}
                    text={pointInfo.alt}
                    pointColor={pointColors[i % pointColors.length]}
                />
            ))}
        </Stack>
    );
};

export const PointResponseMessage = ({ messageId }: MessageProps): ReactNode => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const theme = useTheme();
    const { threadId } = useThreadView();
    const { message } = useMessage(threadId, messageId);
    const { data: lastImagesInThread } = useThread(threadId, (thread) => {
        return thread.messages
            .filter((message) => message.role === Role.User && message.fileUrls?.length)
            .at(-1)?.fileUrls;
    });
    if (!message) {
        return null; // this shouldn't happen
    }
    const { content } = message;
    const pointColors = [
        theme.color['pink-100'].hex,
        theme.color['purple-100'].hex,
        theme.color['green-100'].hex,
    ];

    if (lastImagesInThread == null) {
        return <StandardMessage messageId={messageId} />;
    }

    const pointInfos = extractPointData(content);

    if (pointInfos == null) {
        return <StandardMessage messageId={messageId} />;
    }

    const handleClose = () => {
        setIsModalOpen(false);
    };

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
                        imageLink={lastImagesInThread[0]}
                        pointInfos={pointInfos}
                        pointColors={pointColors}
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
                        imageLink={lastImagesInThread[0]}
                        pointInfos={pointInfos}
                        pointColors={pointColors}
                        caption={
                            <PointPictureCaption
                                pointInfos={pointInfos}
                                pointColors={pointColors}
                            />
                        }
                        sx={{ gridArea: 'combined' }}
                    />
                </PointPictureModal>
                <PointPictureCaption pointInfos={pointInfos} pointColors={pointColors} />
            </Box>
            <MarkdownRenderer>{content.replaceAll(pointRegex, '**$<text>**')}</MarkdownRenderer>
        </>
    );
};
