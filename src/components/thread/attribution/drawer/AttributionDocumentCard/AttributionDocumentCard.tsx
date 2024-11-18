import { Button, Card, CardContent, Link, Skeleton, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

import { useAppContext } from '@/AppContext';
import { useFeatureToggles } from '@/FeatureToggleContext';
import { links } from '@/Links';

import { UrlForDocumentAttribution } from '../UrlForDocumentAttribution';
import { AttributionDocumentCardSnippets } from './AttributionDocumentCardSnippets';

interface AttributionDocumentCardBaseProps {
    snippets: ReactNode;
    url?: ReactNode;
    source: ReactNode;
    actions?: ReactNode;
}

const AttributionDocumentCardBase = ({
    snippets,
    url,
    source,
    actions,
}: AttributionDocumentCardBaseProps) => {
    return (
        <Card
            component="li"
            sx={{
                // this bgcolor is the varnish off-white with 80% opacity
                bgcolor: (theme) =>
                    `color-mix(in srgb, ${theme.palette.background.paper} 80%, transparent)`,
                listStyle: 'none',

                borderLeft: (theme) => `${theme.spacing(1)} solid transparent`,

                '&[data-previewed-document="true"]': {
                    borderColor: (theme) => theme.palette.primary.light,
                },

                '&[data-selected-document="true"]': {
                    borderColor: (theme) => theme.palette.primary.main,
                },
            }}>
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
    const { isDatasetExplorerEnabled } = useFeatureToggles();

    return (
        <AttributionDocumentCardBase
            snippets={<AttributionDocumentCardSnippets documentIndex={documentIndex} />}
            url={<UrlForDocumentAttribution url={documentUrl} />}
            source={`Source: ${source}`}
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
