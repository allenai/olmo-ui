import varnishTheme from '@allenai/varnish-theme';
import { Box, Stack } from '@mui/system';
import { ReactNode } from 'react';

import { Role } from '@/api/Role';
import { useAppContext } from '@/AppContext';

import { MarkdownRenderer } from '../Markdown/MarkdownRenderer';
import { extractPointData } from '../points/extractPointData';
import { pointRegex } from '../points/pointRegex';
import { MessageViewProps, StandardMessage } from '../ThreadDisplay/MessageView';

const PointCircle = ({
    xPercent,
    yPercent,
    fill,
}: {
    xPercent: number;
    yPercent: number;
    fill: string;
}): ReactNode => {
    return (
        <>
            <circle cx={`${xPercent}%`} cy={`${yPercent}%`} r={5} fill={fill} />{' '}
            <circle
                cx={`${xPercent}%`}
                cy={`${yPercent}%`}
                fill="none"
                r="10"
                stroke={fill}
                strokeWidth="1">
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
        </>
    );
};

// TODO: See if I can get these through the theme
const POINT_COLORS = [
    varnishTheme.color['pink-100'].value,
    varnishTheme.color['purple-100'].value,
    varnishTheme.color['green-100'].value,
];

export const PointResponseMessage = ({ messageId }: MessageViewProps): ReactNode => {
    const content = useAppContext((state) => state.selectedThreadMessagesById[messageId].content);
    const lastImagesInThread = useAppContext((state) => {
        return state.selectedThreadMessages
            .map((messageId) => state.selectedThreadMessagesById[messageId])
            .filter((message) => message.role === Role.User && message.fileUrls?.length)
            .at(-1)?.fileUrls;
    });

    if (lastImagesInThread == null) {
        return <StandardMessage messageId={messageId} />;
    }

    const pointInfos = extractPointData(content);

    if (pointInfos == null) {
        return <StandardMessage messageId={messageId} />;
    }

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplate: 'auto / auto',
                gridTemplateAreas: '"combined"',
                width: 'min-content',
            }}>
            <img src={lastImagesInThread[0]} alt="" style={{ gridArea: 'combined' }} />
            {pointInfos.map((pointInfo, i) => {
                return (
                    <svg
                        key={i}
                        style={{
                            gridArea: 'combined',
                            height: '100%',
                            width: '100%',
                            zIndex: 1,
                        }}>
                        {pointInfo.points.map((point, pointIndex) => (
                            <PointCircle
                                xPercent={point.x}
                                yPercent={point.y}
                                key={pointIndex}
                                fill={POINT_COLORS[i % 3]}
                            />
                        ))}
                    </svg>
                );
            })}
            <Stack gap={2} useFlexGap>
                {pointInfos.map((pointInfo, i) => (
                    <Stack key={i} gap="1ch" useFlexGap direction="row" alignItems="center">
                        <svg viewBox="0 0 20 20" height="1em" width="1em">
                            <PointCircle xPercent={50} yPercent={50} fill={POINT_COLORS[i % 3]} />
                        </svg>
                        {pointInfo.alt}
                    </Stack>
                ))}
            </Stack>
            <MarkdownRenderer>{content.replaceAll(pointRegex, '**$<text>**')}</MarkdownRenderer>
        </Box>
    );
};
