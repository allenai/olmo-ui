import { Card, CardActionArea, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { PropsWithChildren, ReactNode } from 'react';

import { useAppContext } from '@/AppContext';

import { BoldTextForDocumentAttribution } from './BoldTextForDocumentAttribution';

interface AttributionDocumentCardBaseProps {
    title: ReactNode;
    text: ReactNode;
    source: ReactNode;
    // href: string;
    setSelectedDocument?: () => void;
    setPreviewDocument?: () => void;
    unsetPreviewDocument?: () => void;
    isSelected?: boolean;
    isPreviewed?: boolean;
}

const AttributionDocumentCardBase = ({
    setSelectedDocument,
    setPreviewDocument,
    unsetPreviewDocument,
    isSelected,
    isPreviewed,
    title,
    text,
    source,
}: AttributionDocumentCardBaseProps) => {
    return (
        <Card
            sx={{
                bgcolor: '#F8F0E780',
            }}>
            <CardActionArea
                disabled={setSelectedDocument == null}
                onClick={() => {
                    setSelectedDocument?.();
                }}
                onMouseEnter={() => {
                    setPreviewDocument?.();
                }}
                onMouseLeave={() => {
                    unsetPreviewDocument?.();
                }}
                onFocus={() => {
                    setPreviewDocument?.();
                }}
                onBlur={() => {
                    unsetPreviewDocument?.();
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
                    }}
                    data-selected-document={isSelected}
                    data-previewed-document={isPreviewed}>
                    <Typography
                        variant="body1"
                        fontWeight="bold"
                        component="h4"
                        margin={0}
                        sx={{
                            // This isn't _standard_ standard but it's widely available
                            // It uses an older version of a Chrome flex implementation that's supported in Safari and FF
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            '-webkit-line-clamp': '2',
                            lineClamp: '2',
                            '-webkit-box-orient': 'vertical',
                        }}>
                        {title}
                    </Typography>
                    <Typography variant="body1">{text}</Typography>
                    {/* todo: Switch this to theme.typography.fontWeightSemiBold when it's added  */}
                    <Typography variant="body2" fontWeight={600} component="span">
                        {source}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

interface AttributionDocumentCardProps {
    title?: string;
    text: string;
    source: string;
    documentIndex: string;
    // href: string;
}

const MISSING_DOCUMENT_TITLE_TEXT = 'Untitled Document';

export const AttributionDocumentCard = ({
    title,
    text,
    source,
    documentIndex,
}: AttributionDocumentCardProps): JSX.Element => {
    const { spans, snippets } = useAppContext((state) => {
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
    });

    return (
        <AttributionDocumentCardBase
            title={title ?? MISSING_DOCUMENT_TITLE_TEXT}
            text={
                <Stack direction="column" gap={2}>
                    {snippets.map((snippet) => (
                        <BoldTextForDocumentAttribution
                            key={snippet}
                            correspondingSpans={spans}
                            text={snippet}
                        />
                    ))}
                </Stack>
            }
            source={`Source: ${source}`}
        />
    );
};

export const AttributionDocumentCardSkeleton = (): JSX.Element => {
    return (
        <AttributionDocumentCardBase
            title={<Skeleton />}
            text={
                <>
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                </>
            }
            source={<Skeleton />}
        />
    );
};
