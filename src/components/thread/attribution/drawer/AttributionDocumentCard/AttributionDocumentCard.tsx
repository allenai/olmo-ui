import { Button, Card, CardActions, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

import { links } from '@/Links';

import { UrlForDocumentAttribution } from '../UrlForDocumentAttribution';
import { AttributionDocumentCardSnippets } from './AttributionDocumentCardSnippets';

interface AttributionDocumentCardBaseProps {
    snippets: ReactNode;
    url?: ReactNode;
    source: ReactNode;
    datasetExplorerLink: ReactNode;
    numRepetitions: number;
    // href: string;
}

const AttributionDocumentCardBase = ({
    snippets,
    url,
    source,
    datasetExplorerLink,
    numRepetitions,
}: AttributionDocumentCardBaseProps) => {
    return (
        <Card
            component="li"
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
            <CardContent component={Stack} direction="column" gap={1}>
                <Typography variant="body1" component="span">{snippets}</Typography>
                {/* todo: Switch this to theme.typography.fontWeightSemiBold when it's added  */}
                <Typography
                    variant="body2"
                    fontWeight={(theme) => theme.typography.fontWeightBold}
                    component="span">
                    {url}
                </Typography>
                <Typography variant="body2" fontWeight={600} component="span">
                    {source}
                </Typography>
                {numRepetitions > 1 && (
                    <Typography variant="body2" fontWeight={600} component="span">
                        Document repeated {numRepetitions} times in result
                        {/* TODO: Make the "Show all" link work */}
                        {/* <Link href="" underline="always">
                            <Typography variant="caption">Show all</Typography>
                        </Link> */}
                    </Typography>
                )}
            </CardContent>
            <CardActions sx={{ padding: 2, paddingBlockStart: 0 }}>
                {datasetExplorerLink != null && datasetExplorerLink}
            </CardActions>
        </Card>
    );
};

interface AttributionDocumentCardProps {
    documentUrl?: string;
    source: string;
    documentIndex: string;
    numRepetitions: number;
}

export const AttributionDocumentCard = ({
    documentUrl,
    source,
    documentIndex,
    numRepetitions,
}: AttributionDocumentCardProps): JSX.Element => {
    return (
        <AttributionDocumentCardBase
            snippets={<AttributionDocumentCardSnippets documentIndex={documentIndex} />}
            url={<UrlForDocumentAttribution url={documentUrl} />}
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
            numRepetitions={numRepetitions}
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
            datasetExplorerLink={<Skeleton />}
            numRepetitions={1}
        />
    );
};
