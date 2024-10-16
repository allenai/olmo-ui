import { Button, Card, CardActions, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { ReactNode, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';


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

const MISSING_DOCUMENT_TITLE_TEXT = 'Untitled Document';

const SNIPPET_TRANSITION_TIME = '300ms';

export const AttributionDocumentCardSnippets = ({
    documentIndex,
}: Pick<AttributionDocumentCardProps, 'documentIndex'>) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
        setExpanded((prevExpanded) => !prevExpanded);
    };

    const { spans, snippets } = useAppContext(
        useShallow((state) => {
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
        })
    );

    if (snippets.length === 0) {
        return null;
    }

    const [firstSnippet, ...restSnippets] = snippets;

    return (
        <Stack direction="column" gap={1}>
            <Box>
                <BoldTextForDocumentAttribution
                    key={firstSnippet.text}
                    correspondingSpans={[firstSnippet.corresponding_span_text]}
                    text={firstSnippet.text}
                />
            </Box>
            <Box
                sx={[
                    {
                        // This uses grid's ability to transition to 1fr height to animate the other snippets showing
                        // https://css-tricks.com/css-grid-can-do-auto-height-transitions/
                        display: 'grid',
                        gridTemplateRows: '1fr',
                        overflow: 'hidden',
                        transitionProperty: 'grid-template-rows, margin-block-end',
                        transitionDuration: SNIPPET_TRANSITION_TIME,
                        transitionTimingFunction: 'ease',
                    },
                    !expanded && {
                        marginBlockEnd: -1,
                        gridTemplateRows: '0fr',
                    },
                ]}>
                <Box
                    sx={[
                        {
                            // This combines with the grid transition above to help the animation
                            minHeight: 0,
                            transition: `visibility ${SNIPPET_TRANSITION_TIME}`,
                            visibility: 'visible',
                        },
                        !expanded && {
                            visibility: 'hidden',
                        },
                    ]}>
                    {restSnippets.map((snippet) => (
                        <BoldTextForDocumentAttribution
                            key={snippet.text}
                            correspondingSpans={[snippet.corresponding_span_text]}
                            text={snippet.text}
                        />
                    ))}
                </Box>
            </Box>

            {snippets.length > 1 && (
                <Link
                    component="button"
                    onClick={toggleExpanded}
                    underline="always"
                    alignSelf="start">
                    Show {expanded ? 'less' : 'more'}
                </Link>
            )}
        </Stack>
    );
};

export const AttributionDocumentCard = ({
    text,
    documentUrl,
    source,
    documentIndex,
    numRepetitions,
}: AttributionDocumentCardProps): JSX.Element => {
    return (
        <AttributionDocumentCardBase
            text={<AttributionDocumentCardSnippets documentIndex={documentIndex} />}
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
