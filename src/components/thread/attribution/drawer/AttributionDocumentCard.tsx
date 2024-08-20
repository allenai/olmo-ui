import { Card, CardActionArea, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

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
        <Card>
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
                    <Typography variant="h6" component="h2" margin={0}>
                        {title}
                    </Typography>
                    <Typography variant="body1">{text}</Typography>
                    <Typography variant="subtitle1" fontWeight="bold" component="span">
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
    const isSelected = useAppContext(
        (state) => state.attribution.selectedDocumentIndex === documentIndex
    );

    const spans = useAppContext((state) => {
        const selectedMessageId = state.attribution.selectedMessageId;

        if (selectedMessageId != null) {
            const documents =
                state.attribution.attributionsByMessageId[selectedMessageId]?.documents ?? {};

            return documents[documentIndex]?.corresponding_spans;
        }
    });

    const setSelectedDocument = useAppContext((state) => () => {
        state.selectDocument(documentIndex);
    });

    const isPreviewed = useAppContext(
        (state) => state.attribution.previewDocumentIndex === documentIndex
    );

    const setPreviewDocument = useAppContext((state) => () => {
        state.previewDocument(documentIndex);
    });
    const unsetPreviewDocument = useAppContext((state) => () => {
        state.stopPreviewingDocument(documentIndex);
    });

    return (
        <AttributionDocumentCardBase
            title={title ?? MISSING_DOCUMENT_TITLE_TEXT}
            text={<BoldTextForDocumentAttribution correspondingSpans={spans} text={text} />}
            source={`Source: ${source}`}
            isSelected={isSelected}
            setSelectedDocument={setSelectedDocument}
            isPreviewed={isPreviewed}
            setPreviewDocument={setPreviewDocument}
            unsetPreviewDocument={unsetPreviewDocument}
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
