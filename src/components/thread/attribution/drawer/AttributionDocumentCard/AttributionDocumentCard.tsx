import { Button, Card, CardContent, Link, Stack, Typography } from '@mui/material';
import { forwardRef, PropsWithChildren, ReactNode, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useAppContext } from '@/AppContext';
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

const AttributionDocumentCardBase = forwardRef<HTMLLIElement, AttributionDocumentCardBaseProps>(
    function AttributionDocumentCardBase(
        { snippets, source, actions, isSelected, relevanceBucket },
        ref
    ) {
        return (
            <Card
                ref={ref}
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
                    <Typography variant="body2" fontWeight={600} component="span">
                        {source}
                    </Typography>
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
    }
);

interface AttributionDocumentCardProps {
    source: string;
    documentId: string;
    index?: string | null;
    repeatedDocumentCount?: number;
    relevanceBucket: AttributionBucket;
    onSelect?: (target: HTMLLIElement) => void;
}

export const AttributionDocumentCard = ({
    source,
    index,
    documentId,
    repeatedDocumentCount,
    relevanceBucket,
    onSelect,
}: AttributionDocumentCardProps): JSX.Element => {
    const selectRepeatedDocument = useAppContext((state) => state.selectRepeatedDocument);
    const { isDatasetExplorerEnabled } = useFeatureToggles();

    const selectDocument = useAppContext((state) => state.selectDocument);
    const unselectDocument = useAppContext((state) => state.unselectDocument);

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

    const isSelected = useAppContext(
        (state) =>
            state.attribution.selection?.type === 'document' &&
            state.attribution.selection.documentIndex === documentId
    );

    const cardRef = useRef<HTMLLIElement>(null);

    return (
        <AttributionDocumentCardBase
            ref={cardRef}
            snippets={<AttributionDocumentCardSnippets snippets={snippets} />}
            source={source}
            isSelected={isSelected}
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

                    <Button
                        variant="text"
                        sx={(theme) => ({
                            '[data-selected-document="true"] &': {
                                fontWeight: theme.font.weight.semiBold,
                                color: theme.palette.secondary.contrastText,
                            },
                        })}
                        onClick={() => {
                            if (isSelected) {
                                unselectDocument(documentId);
                            } else {
                                selectDocument(documentId);
                                if (cardRef.current != null) {
                                    onSelect?.(cardRef.current);
                                }
                            }
                        }}>
                        {isSelected
                            ? 'Show all spans'
                            : `Locate span${snippets.length > 1 ? 's' : ''}`}
                    </Button>

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
