import { styled, Typography, useTheme } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { ReactNode } from 'react';

import { Role } from '@/api/Role';
import { useAppContext } from '@/AppContext';

import { MarkdownRenderer } from '../Markdown/MarkdownRenderer';
import { extractPointData, Point } from '../points/extractPointData';
import { pointRegex } from '../points/pointRegex';
import { MessageProps, StandardMessage } from '../ThreadDisplay/MessageView';
import { MAX_THREAD_IMAGE_HEIGHT } from '../ThreadDisplay/threadDisplayConsts';

interface PointCircleProps {
    xPercent: number;
    yPercent: number;
    fill: string;
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
            <PointCircle
                xPercent={point.x}
                yPercent={point.y}
                key={pointIndex}
                fill={fill}
                shouldAnimate
            />
        ))}
    </PointOnImageSvg>
);

interface PointLabelProps {
    pointColor: string;
    text: string;
}
const PointLabel = ({ pointColor, text }: PointLabelProps): ReactNode => (
    <Stack gap="0.5ch" useFlexGap direction="row" alignItems="center">
        <svg viewBox="0 0 20 20" height="1em" width="1em" aria-hidden style={{ color: pointColor }}>
            <PointCircle xPercent={50} yPercent={50} fill={pointColor} />
        </svg>
        <Typography>{text}</Typography>
    </Stack>
);

export const PointResponseMessage = ({ messageId }: MessageProps): ReactNode => {
    const content = useAppContext((state) => state.selectedThreadMessagesById[messageId].content);
    const lastImagesInThread = useAppContext((state) => {
        return state.selectedThreadMessages
            .map((messageId) => state.selectedThreadMessagesById[messageId])
            .filter((message) => message.role === Role.User && message.fileUrls?.length)
            .at(-1)?.fileUrls;
    });

    const theme = useTheme();
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

    return (
        <>
            <Box component="figure" sx={{ margin: 0 }}>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplate: 'auto / auto',
                        gridTemplateAreas: '"combined"',
                        width: 'fit-content',
                        height: 'fit-content',
                        maxWidth: '100%',
                    }}>
                    <Box
                        component="img"
                        src={lastImagesInThread[0]}
                        alt=""
                        sx={{
                            gridArea: 'combined',
                            maxHeight: MAX_THREAD_IMAGE_HEIGHT,
                            objectFit: 'contain',
                            height: 'auto',
                            maxWidth: '100%',
                        }}
                    />
                    {pointInfos.map((pointInfo, i) => {
                        return (
                            <PointOnImage
                                key={i}
                                points={pointInfo.points}
                                fill={pointColors[i % pointColors.length]}
                            />
                        );
                    })}
                </Box>
                <Stack gap={2} useFlexGap component="figcaption">
                    {pointInfos.map((pointInfo, i) => (
                        <PointLabel
                            key={i}
                            text={pointInfo.alt}
                            pointColor={pointColors[i % pointColors.length]}
                        />
                    ))}
                </Stack>
            </Box>
            <MarkdownRenderer>{content.replaceAll(pointRegex, '**$<text>**')}</MarkdownRenderer>
        </>
    );
};
