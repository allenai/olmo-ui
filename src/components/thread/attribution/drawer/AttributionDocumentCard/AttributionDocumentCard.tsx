import { Button, Card, CardContent, Link, Stack, Typography } from '@mui/material';
import { PropsWithChildren, ReactNode } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useAppContext } from '@/AppContext';
import { StyledTooltip } from '@/components/StyledTooltip';
import { useFeatureToggles } from '@/FeatureToggleContext';
import { links } from '@/Links';

import { AttributionBucket } from '../../calculate-relevance-score';
import { AttributionDocumentCardSnippets } from './AttributionDocumentCardSnippets';

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
                        Source:{' '}
                    </Typography>
                    {source}
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
    const spans = `span${snippetCount > 1 ? 's' : ''}`;

    const label = locateUnavailable
        ? 'Locating span is not available when a span is selected'
        : isDocumentSelected
          ? 'Restore all span highlights'
          : `Highlight ${spans} in the selected message`;

    return (
        <StyledTooltip title={label} placement="top">
            {/* Mui won't show a tooltip if the child is disabled, so the <Button> needs to be wrapped */}
            <span>
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
                    {isDocumentSelected ? 'Show all spans' : `Locate ${spans}`}
                </Button>
            </span>
        </StyledTooltip>
    );
};
