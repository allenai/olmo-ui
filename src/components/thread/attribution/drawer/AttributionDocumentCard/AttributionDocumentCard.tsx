import { Button, Card, CardContent, Link, Stack, Typography } from '@mui/material';
import { PropsWithChildren, ReactNode } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useAppContext } from '@/AppContext';
import { StyledTooltip } from '@/components/StyledTooltip';
import { useFeatureToggles } from '@/FeatureToggleContext';
import { links } from '@/Links';

import { AttributionBucket } from '../../calculate-relevance-score';
import { AttributionDocumentCardSnippets } from './AttributionDocumentCardSnippets';

const deduceUsageFromSource = (source: string): string => {
    switch (source) {
        case 'dclm-hero-run-fasttext_for_HF':
        case 'dclm':
        case 'arxiv':
        case 'algebraic-stack':
        case 'open-web-math':
        case 'pes2o':
        case 'starcoder':
        case 'wiki':
            return 'Pre-training';
        case 'dolmino':
            return 'Mid-training';
        case 'tulu-3-sft-olmo-2-mixture':
            return 'Post-training (SFT)';
        case 'olmo-2-1124-13b-preference-mix':
            return 'Post-training (DPO)';
        case 'RLVR-GSM-MATH-IF-Mixed-Constraints':
            return 'Post-training (RLVR)';
        default:
            return '';
    }
};

const prettifySource = (source: string): ReactNode => {
    let displayName = '';
    let url = '';
    let secondaryName = '';
    switch (source) {
        case 'dclm-hero-run-fasttext_for_HF':
        case 'dclm':
            displayName = 'olmo-mix-1124';
            url = 'https://huggingface.co/datasets/allenai/olmo-mix-1124';
            secondaryName = 'web corpus (DCLM)';
            break;
        case 'arxiv':
        case 'algebraic-stack':
        case 'open-web-math':
        case 'pes2o':
        case 'starcoder':
        case 'wiki':
            displayName = 'olmo-mix-1124';
            url = 'https://huggingface.co/datasets/allenai/olmo-mix-1124';
            secondaryName = source;
            break;
        case 'dolmino':
            displayName = 'dolmino-mix-1124';
            url = 'https://huggingface.co/datasets/allenai/dolmino-mix-1124';
            break;
        case 'tulu-3-sft-olmo-2-mixture':
            displayName = 'tulu-3-sft-olmo-2-mixture';
            url = 'https://huggingface.co/datasets/allenai/tulu-3-sft-olmo-2-mixture';
            break;
        case 'olmo-2-1124-13b-preference-mix':
            displayName = 'olmo-2-1124-13b-preference-mix';
            url = 'https://huggingface.co/datasets/allenai/olmo-2-1124-13b-preference-mix';
            break;
        case 'RLVR-GSM-MATH-IF-Mixed-Constraints':
            displayName = 'RLVR-GSM-MATH-IF-Mixed-Constraints';
            url = 'https://huggingface.co/datasets/allenai/RLVR-GSM-MATH-IF-Mixed-Constraints';
            break;
        default:
            return <></>;
    }

    return (
        <>
            <Link href={url} target="_blank" fontWeight={600} color="primary" underline="always">
                {displayName}
            </Link>
            {secondaryName !== '' && (
                <Typography
                    variant="body2"
                    component="span"
                    sx={{ color: (theme) => theme.palette.text.secondary }}>
                    {' > '}
                    {secondaryName}
                </Typography>
            )}
        </>
    );
};

interface AttributionDocumentCardActionWrapperProps extends PropsWithChildren {}

interface AttributionDocumentCardBaseProps extends AttributionDocumentCardActionWrapperProps {
    snippets: ReactNode;
    source: string;
    actions?: ReactNode;
    isSelected?: boolean;
    relevanceBucket: AttributionBucket;
}

const AttributionDocumentCardBase = ({
    snippets,
    source,
    actions,
    isSelected,
    relevanceBucket,
}: AttributionDocumentCardBaseProps): ReactNode => {
    return (
        <Card
            component="li"
            data-selected-document={isSelected}
            data-document-relevance={relevanceBucket}
            sx={(theme) => ({
                bgcolor:
                    theme.palette.mode === 'dark'
                        ? theme.palette.background.drawer.primary
                        : theme.palette.background.default,
                overflow: 'visible',
                borderRadius: 3,

                // Note:
                // These need are related to opacity for spans in
                // `../../AttributionHilight.tsx`
                //
                '--base-border-color': theme.palette.secondary.main,
                borderLeft: '9px solid var(--base-border-color)',

                '&[data-document-relevance="high"]': {
                    // no-op
                },
                '&[data-document-relevance="medium"]': {
                    borderColor: 'rgb(from var(--base-border-color) r g b / 50%)',
                },
                '&[data-document-relevance="low"]': {
                    borderColor: 'rgb(from var(--base-border-color) r g b / 25%)',
                },

                '&[data-selected-document="true"]': {
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText,
                    borderColor: (theme) => theme.palette.secondary.main,
                },
            })}>
            <CardContent component={Stack} direction="column" gap={1}>
                <div>
                    <Typography variant="body2" fontWeight={600} component="span">
                        {deduceUsageFromSource(source)} document from:
                        <br />
                    </Typography>
                    <Typography variant="body2" component="span">
                        {prettifySource(source)}
                    </Typography>
                </div>
                <Typography variant="body1" component="span">
                    {snippets}
                </Typography>
                {/* todo: Switch this to theme.typography.fontWeightSemiBold when it's added  */}
            </CardContent>
            <Stack direction="column" alignItems="start" p={2} paddingBlockStart={0} gap={1}>
                {actions}
            </Stack>
        </Card>
    );
};

interface AttributionDocumentCardProps {
    source: string;
    documentId: string;
    index?: string | null;
    repeatedDocumentCount?: number;
    relevanceBucket: AttributionBucket;
}

export const AttributionDocumentCard = ({
    source,
    index,
    documentId,
    repeatedDocumentCount,
    relevanceBucket,
}: AttributionDocumentCardProps): ReactNode => {
    const selectRepeatedDocument = useAppContext((state) => state.selectRepeatedDocument);
    const { isDatasetExplorerEnabled } = useFeatureToggles();

    const snippets = useAppContext(
        useShallow((state) => {
            const selectedMessageId = state.attribution.selectedMessageId;

            if (selectedMessageId != null) {
                const documents =
                    state.attribution.attributionsByMessageId[selectedMessageId]?.documents ?? {};

                const document = documents[documentId];

                return document?.snippets ?? [];
            } else {
                return [];
            }
        })
    );

    const isDocumentSelected = useAppContext(
        (state) =>
            state.attribution.selection?.type === 'document' &&
            state.attribution.selection.documentIndex === documentId
    );

    return (
        <AttributionDocumentCardBase
            snippets={<AttributionDocumentCardSnippets snippets={snippets} />}
            source={source}
            isSelected={isDocumentSelected}
            relevanceBucket={relevanceBucket}
            actions={
                <>
                    {isDatasetExplorerEnabled && (
                        <Button
                            href={links.document(documentId, index)}
                            variant="outlined"
                            color="inherit"
                            size="small"
                            fullWidth={false}
                            sx={{
                                width: 'fit-content',
                            }}>
                            View Document
                        </Button>
                    )}

                    <LocateSpanButton
                        documentId={documentId}
                        snippetCount={snippets.length}
                        isDocumentSelected={isDocumentSelected}
                    />

                    {repeatedDocumentCount != null && repeatedDocumentCount > 1 && (
                        <Stack direction="column" alignItems="start">
                            <Typography variant="body2" fontWeight={600}>
                                Document repeated {repeatedDocumentCount} times in result
                            </Typography>
                            <Link
                                component="button"
                                variant="body2"
                                onClick={() => {
                                    selectRepeatedDocument(documentId);
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

interface LocateSpanProps {
    documentId: string;
    isDocumentSelected: boolean;
    snippetCount: number;
}

const LocateSpanButton = ({
    documentId,
    isDocumentSelected,
    snippetCount,
}: LocateSpanProps): ReactNode => {
    const selectDocument = useAppContext((state) => state.selectDocument);
    const unselectDocument = useAppContext((state) => state.unselectDocument);

    const isSpanSelected = useAppContext((state) => state.attribution.selection != null);

    const noDocumentsSelected = useAppContext(
        (state) => !(state.attribution.selection?.type === 'document')
    );

    const locateUnavailable = isSpanSelected && noDocumentsSelected;

    const locateButton = (
        <Button
            variant="text"
            disabled={locateUnavailable}
            sx={(theme) => ({
                padding: 0,
                fontWeight: 'semiBold',
                '[data-selected-document="true"] &': {
                    fontWeight: theme.font.weight.semiBold,
                    color: theme.palette.secondary.contrastText,
                },
            })}
            onClick={() => {
                if (isDocumentSelected) {
                    unselectDocument(documentId);
                } else {
                    selectDocument(documentId);
                }
            }}>
            {isDocumentSelected ? 'Show all spans' : `Locate span${snippetCount > 1 ? 's' : ''}`}
        </Button>
    );

    if (locateUnavailable) {
        return (
            <StyledTooltip
                title="Locating span is not available when a span is selected"
                placement="top">
                {/* Mui won't show a tooltip if the child is disabled, so the <Button> needs to be wrapped */}
                <span>{locateButton}</span>
            </StyledTooltip>
        );
    }

    return locateButton;
};
