import { Card, CardActionArea, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

import { useAppContext } from '@/AppContext';

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
    matchesSpan: string[];
    // href: string;
}

const MISSING_DOCUMENT_TITLE_TEXT = 'Untitled Document';

export const AttributionDocumentCard = ({
    title,
    text,
    source,
    documentIndex,
    matchesSpan,
}: AttributionDocumentCardProps): JSX.Element => {
    const isSelected = useAppContext(
        (state) => state.attribution.selectedDocumentIndex === documentIndex
    );

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

    const renderBoldText = (): ReactNode => {
        if (matchesSpan.length === 0) {
            return text;
        }

        // Create a regex pattern that matches all substrings
        const regexPattern = new RegExp(`(${matchesSpan.join('|')})`, 'gi');

        // Split the text based on the substrings
        const splitTextSegments = text.split(regexPattern);

        return (
            <>
                {splitTextSegments.map((segment, index) => {
                    // Check if the segment matches any of the substrings exactly
                    const isExactMatch = matchesSpan.some(
                        (substring) => substring.toLowerCase() === segment.toLowerCase()
                    );
                    return isExactMatch ? <strong key={index}>{segment}</strong> : segment;
                })}
            </>
        );
    };

    return (
        <AttributionDocumentCardBase
            title={title ?? MISSING_DOCUMENT_TITLE_TEXT}
            text={renderBoldText()}
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
