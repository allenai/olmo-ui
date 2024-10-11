import { Card, CardActionArea, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

import { useAppContext } from '@/AppContext';

import { BoldTextForDocumentAttribution } from './BoldTextForDocumentAttribution';

interface AttributionDocumentCardBaseProps {
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
    text: string;
    source: string;
    documentIndex: string;
    // href: string;
}

export const AttributionDocumentCard = ({
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
            text={<BoldTextForDocumentAttribution correspondingSpans={spans} text={text} />}
            source={`Source: ${source}`}
        />
    );
};

export const AttributionDocumentCardSkeleton = (): JSX.Element => {
    return (
        <AttributionDocumentCardBase
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
