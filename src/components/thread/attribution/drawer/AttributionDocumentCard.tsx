import { Button, Card, CardActions, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

import { useAppContext } from '@/AppContext';
import { links } from '@/Links';

import { BoldTextForDocumentAttribution } from './BoldTextForDocumentAttribution';
import { UrlForDocumentAttribution } from './UrlForDocumentAttribution';

interface AttributionDocumentCardBaseProps {
    text: ReactNode;
    url?: ReactNode;
    source: ReactNode;
    datasetExplorerLink: ReactNode;
    numRepetitions: number;
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
    text,
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
            <CardContent
                component={Stack}
                direction="column"
                gap={1}
                data-selected-document={isSelected}
                data-previewed-document={isPreviewed}>
                <Typography variant="body1">{text}</Typography>
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
    text: string;
    documentUrl?: string;
    source: string;
    documentIndex: string;
    numRepetitions: number;
}

export const AttributionDocumentCard = ({
    text,
    documentUrl,
    source,
    documentIndex,
    numRepetitions,
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
            numRepetitions={1}
        />
    );
};
