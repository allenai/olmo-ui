import { Box, Card, CardContent, Link, Skeleton, Stack, Typography } from '@mui/material';
import { CSSProperties, ReactNode, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useAppContext } from '@/AppContext';

import { BoldTextForDocumentAttribution } from './BoldTextForDocumentAttribution';

interface AttributionDocumentCardBaseProps {
    title: ReactNode;
    text: ReactNode;
    source: ReactNode;
    // href: string;
}

const AttributionDocumentCardBase = ({ title, text, source }: AttributionDocumentCardBaseProps) => {
    return (
        <Card
            sx={{
                bgcolor: '#F8F0E780',
            }}>
            <CardContent
                component={Stack}
                direction="column"
                gap={1}
                sx={{
                    borderLeft: (theme) => `${theme.spacing(1)} solid transparent`,

                    '&[data-previewed-document="true"]': {
                        borderColor: (theme) => theme.palette.primary.light,
                    },

                    '&[data-selected-document="true"]': {
                        borderColor: (theme) => theme.palette.primary.main,
                    },
                }}>
                <Typography
                    variant="body1"
                    fontWeight="bold"
                    component="h4"
                    margin={0}
                    sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        // This isn't _standard_ standard but it's widely available
                        // It uses an older version of a Chrome flex implementation that's supported in Safari and FF
                        '-webkit-line-clamp': '2',
                        lineClamp: '2',
                        '-webkit-box-orient': 'vertical',
                    }}>
                    {title}
                </Typography>
                {text}
                {/* todo: Switch this to theme.typography.fontWeightSemiBold when it's added  */}
                <Typography variant="body2" fontWeight={600} component="span">
                    {source}
                </Typography>
            </CardContent>
        </Card>
    );
};

interface AttributionDocumentCardProps {
    title?: string;
    source: string;
    documentIndex: string;
    // href: string;
}

const MISSING_DOCUMENT_TITLE_TEXT = 'Untitled Document';

const SNIPPET_TRANSITION_TIME = '300ms';

export const AttributionDocumentCardSnippets = ({
    documentIndex,
}: Pick<AttributionDocumentCardProps, 'documentIndex'>) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
        setExpanded((prevExpanded) => !prevExpanded);
    };

    const { spans, snippets } = useAppContext(
        useShallow((state) => {
            const selectedMessageId = state.attribution.selectedMessageId;

            if (selectedMessageId != null) {
                const documents =
                    state.attribution.attributionsByMessageId[selectedMessageId]?.documents ?? {};

                const document = documents[documentIndex];

                return {
                    spans: document?.corresponding_span_texts,
                    snippets: document?.snippets ?? [],
                };
            } else {
                return { spans: [], snippets: [] };
            }
        })
    );

    if (snippets.length === 0) {
        return null;
    }

    const [firstSnippet, ...restSnippets] = snippets;

    return (
        <Stack direction="column" gap={1}>
            <BoldTextForDocumentAttribution
                key={firstSnippet}
                correspondingSpans={spans}
                text={firstSnippet}
            />
            <Box
                sx={[
                    {
                        // This uses grid's ability to transition to 1fr height to animate the other snippets showing
                        // https://css-tricks.com/css-grid-can-do-auto-height-transitions/
                        display: 'grid',
                        gridTemplateRows: '1fr',
                        overflow: 'hidden',
                        transitionProperty: 'grid-template-rows, margin-block-end',
                        transitionDuration: SNIPPET_TRANSITION_TIME,
                        transitionTimingFunction: 'ease',
                    },
                    !expanded && {
                        marginBlockEnd: -1,
                        gridTemplateRows: '0fr',
                    },
                ]}>
                <Box
                    sx={[
                        {
                            // This combines with the grid transition above to help the animation
                            minHeight: 0,
                            transition: `visibility ${SNIPPET_TRANSITION_TIME}`,
                            visibility: 'visible',
                        },
                        !expanded && {
                            visibility: 'hidden',
                        },
                    ]}>
                    {restSnippets.map((snippet) => (
                        <BoldTextForDocumentAttribution
                            key={snippet}
                            correspondingSpans={spans}
                            text={snippet}
                        />
                    ))}
                </Box>
            </Box>

            {snippets.length > 1 && (
                <Link
                    component="button"
                    onClick={toggleExpanded}
                    underline="always"
                    alignSelf="start">
                    Show {expanded ? 'less' : 'more'}
                </Link>
            )}
        </Stack>
    );
};

export const AttributionDocumentCard = ({
    title,
    source,
    documentIndex,
}: AttributionDocumentCardProps): JSX.Element => {
    return (
        <AttributionDocumentCardBase
            title={title ?? MISSING_DOCUMENT_TITLE_TEXT}
            text={<AttributionDocumentCardSnippets documentIndex={documentIndex} />}
            source={`Source: ${source}`}
        />
    );
};

export const AttributionDocumentCardSkeleton = (): JSX.Element => {
    return (
        <AttributionDocumentCardBase
            title={<Skeleton />}
            text={
                <Typography variant="body1">
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                </Typography>
            }
            source={<Skeleton />}
        />
    );
};
