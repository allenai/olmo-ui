import {
    Button,
    Card,
    CardActionArea,
    CardContent,
    Link,
    Skeleton,
    Stack,
    Typography,
} from '@mui/material';
import { Fragment, MouseEventHandler, PropsWithChildren, ReactNode } from 'react';

import { useAppContext } from '@/AppContext';
import { useFeatureToggles } from '@/FeatureToggleContext';
import { links } from '@/Links';

import { UrlForDocumentAttribution } from '../UrlForDocumentAttribution';
import { AttributionDocumentCardSnippets } from './AttributionDocumentCardSnippets';

interface AttributionDocumentCardActionWrapperProps extends PropsWithChildren {
    onClick?: MouseEventHandler;
    onMouseEnter?: MouseEventHandler;
    onMouseLeave?: MouseEventHandler;
}

const CardActionWrapper = ({
    onClick,
    onMouseLeave,
    onMouseEnter,
    children,
}: AttributionDocumentCardActionWrapperProps) => {
    if (onClick != null || onMouseLeave != null || onMouseEnter != null) {
        return (
            <CardActionArea
                onClick={onClick}
                onMouseLeave={onMouseLeave}
                onMouseEnter={onMouseEnter}>
                {children}
            </CardActionArea>
        );
    } else {
        return <Fragment>{children}</Fragment>;
    }
};

interface AttributionDocumentCardBaseProps extends AttributionDocumentCardActionWrapperProps {
    snippets: ReactNode;
    url?: ReactNode;
    source: ReactNode;
    actions?: ReactNode;
    isSelected?: boolean;
    isPreviewed?: boolean;
}

const AttributionDocumentCardBase = ({
    snippets,
    url,
    source,
    actions,
    isSelected,
    isPreviewed,
    onClick,
    onMouseEnter,
    onMouseLeave,
}: AttributionDocumentCardBaseProps) => {
    const handleClick: MouseEventHandler = (event) => {
        // We can have actions that do things on click
        // We want to make sure we don't select this document if someone clicks on one of the actions
        if (typeof (event.target as HTMLElement).onclick !== 'function') {
            onClick?.(event);
        }
    };

    return (
        <Card
            component="li"
            data-previewed-document={isPreviewed}
            data-selected-document={isSelected}
            sx={{
                bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                        ? theme.palette.background.drawer.primary
                        : theme.palette.background.default,
                listStyle: 'none',

                borderLeft: (theme) => `${theme.spacing(1)} solid transparent`,

                '&[data-previewed-document="true"]': {
                    borderColor: (theme) => theme.palette.primary.light,
                },

                '&[data-selected-document="true"]': {
                    borderColor: (theme) => theme.palette.primary.main,
                },
            }}>
            <CardActionWrapper
                onClick={handleClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}>
                <CardContent component={Stack} direction="column" gap={1}>
                    <Typography variant="body1" component="span">
                        {snippets}
                    </Typography>
                    {/* todo: Switch this to theme.typography.fontWeightSemiBold when it's added  */}
                    <Typography variant="body2" fontWeight={600} component="span">
                        {url}
                    </Typography>
                    <Typography variant="body2" fontWeight={600} component="span">
                        {source}
                    </Typography>
                </CardContent>
                <Stack direction="column" alignItems="start" p={2} paddingBlockStart={0} gap={1}>
                    {actions != null && actions}
                </Stack>
            </CardActionWrapper>
        </Card>
    );
};

interface AttributionDocumentCardProps {
    documentUrl?: string;
    source: string;
    documentIndex: string;
    repeatedDocumentCount?: number;
}

export const AttributionDocumentCard = ({
    documentUrl,
    source,
    documentIndex,
    repeatedDocumentCount,
}: AttributionDocumentCardProps): JSX.Element => {
    const selectRepeatedDocument = useAppContext((state) => state.selectRepeatedDocument);
    const { isDatasetExplorerEnabled, attributionSpanFirst } = useFeatureToggles();

    const selectDocument = useAppContext((state) =>
        attributionSpanFirst ? undefined : state.selectDocument
    );
    const previewDocument = useAppContext((state) =>
        attributionSpanFirst ? undefined : state.previewDocument
    );
    const stopPreviewingDocument = useAppContext((state) =>
        attributionSpanFirst ? undefined : state.stopPreviewingDocument
    );

    const isSelected = useAppContext(
        (state) => state.attribution.selectedDocumentIndex === documentIndex
    );
    const isPreviewed = useAppContext(
        (state) => state.attribution.previewDocumentIndex === documentIndex
    );

    return (
        <AttributionDocumentCardBase
            snippets={<AttributionDocumentCardSnippets documentIndex={documentIndex} />}
            url={<UrlForDocumentAttribution url={documentUrl} />}
            onClick={() => {
                selectDocument?.(documentIndex);
            }}
            onMouseEnter={() => {
                previewDocument?.(documentIndex);
            }}
            onMouseLeave={() => {
                stopPreviewingDocument?.(documentIndex);
            }}
            source={`Source: ${source}`}
            isSelected={isSelected}
            isPreviewed={isPreviewed}
            actions={
                <>
                    {isDatasetExplorerEnabled && (
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
                    )}

                    {repeatedDocumentCount != null && repeatedDocumentCount > 1 && (
                        <Stack direction="column" alignItems="start">
                            <Typography variant="body2" fontWeight={600}>
                                Document repeated {repeatedDocumentCount} times in result
                            </Typography>
                            <Link
                                component="button"
                                variant="body2"
                                onClick={() => {
                                    selectRepeatedDocument(documentIndex);
                                }}>
                                View all repeated documents
                            </Link>
                        </Stack>
                    )}
                </>
            }
        />
    );
};

export const AttributionDocumentCardSkeleton = (): JSX.Element => {
    return (
        <AttributionDocumentCardBase
            snippets={
                <Typography variant="body1">
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                </Typography>
            }
            url={<Skeleton />}
            source={<Skeleton />}
            actions={<Skeleton variant="rectangular" />}
        />
    );
};
