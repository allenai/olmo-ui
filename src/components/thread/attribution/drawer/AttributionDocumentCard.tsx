import { Button, Card, CardActions, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

import { useAppContext } from '@/AppContext';
import { links } from '@/Links';

import { BoldTextForDocumentAttribution } from './BoldTextForDocumentAttribution';
import { UrlForDocumentAttribution } from './UrlForDocumentAttribution';

interface AttributionDocumentCardBaseProps {
    title: ReactNode;
    text: ReactNode;
    url?: ReactNode;
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
    url,
    source,
    datasetExplorerLink,
}: AttributionDocumentCardBaseProps) => {
    return (
        <Card
            sx={{
                bgcolor: '#F8F0E780',

                borderLeft: (theme) => `${theme.spacing(1)} solid transparent`,

                '&[data-previewed-document="true"]': {
                    borderColor: (theme) => theme.palette.primary.light,
                },

                '&[data-selected-document="true"]': {
                    borderColor: (theme) => theme.palette.primary.main,
                },
            }}>
            <CardContent
                component={Stack}
                direction="column"
                gap={1}
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
                    {url}
                </Typography>
                <Typography variant="body2" fontWeight={600} component="span">
                    {source}
                </Typography>
            </CardContent>
            <CardActions sx={{ padding: 2, paddingBlockStart: 0 }}>
                {datasetExplorerLink != null && datasetExplorerLink}
            </CardActions>
        </Card>
    );
};

interface AttributionDocumentCardProps {
    title?: string;
    text: string;
    url?: string;
    source: string;
    documentIndex: string;
    // href: string;
}

const MISSING_DOCUMENT_TITLE_TEXT = 'Untitled Document';

export const AttributionDocumentCard = ({
    title,
    text,
    url,
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
            url={<UrlForDocumentAttribution url={url} />}
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
            url={<Skeleton />}
            source={<Skeleton />}
            datasetExplorerLink={<Skeleton />}
        />
    );
};
