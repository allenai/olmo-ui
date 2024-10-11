import { Button, Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

import { useAppContext } from '@/AppContext';
import { links } from '@/Links';

import { BoldTextForDocumentAttribution } from './BoldTextForDocumentAttribution';

interface AttributionDocumentCardBaseProps {
    title: ReactNode;
    text: ReactNode;
    source: ReactNode;
    datasetExplorerLink: ReactNode;
    // href: string;
    setSelectedDocument?: () => void;
    setPreviewDocument?: () => void;
    unsetPreviewDocument?: () => void;
    isSelected?: boolean;
    isPreviewed?: boolean;
}

const AttributionDocumentCardBase = ({
    isSelected,
    isPreviewed,
    title,
    text,
    source,
    datasetExplorerLink,
}: AttributionDocumentCardBaseProps) => {
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
                {datasetExplorerLink != null && datasetExplorerLink}
            </CardContent>
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
    const spans = useAppContext((state) => {
        const selectedMessageId = state.attribution.selectedMessageId;

        if (selectedMessageId != null) {
            const documents =
                state.attribution.attributionsByMessageId[selectedMessageId]?.documents ?? {};

            return documents[documentIndex]?.corresponding_span_texts;
        }
    });

    return (
        <AttributionDocumentCardBase
            title={title ?? MISSING_DOCUMENT_TITLE_TEXT}
            text={<BoldTextForDocumentAttribution correspondingSpans={spans} text={text} />}
            source={`Source: ${source}`}
            datasetExplorerLink={
                <Button
                    href={links.document(documentIndex)}
                    variant="outlined"
                    color="inherit"
                    size="small"
                    fullWidth={false}
                    sx={{
                        width: 'fit-content',
                        // this is slightly further from the thing above it in the design so it gets this extra margin
                        // combined with gap this makes the total margin 2
                        marginBlockStart: 1,
                    }}>
                    Open in Dataset Explorer
                </Button>
            }
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
            datasetExplorerLink={<Skeleton />}
        />
    );
};
