import { Button, Card, CardContent, Link, Stack, Typography } from '@mui/material';
import { PropsWithChildren, ReactNode } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useAppContext } from '@/AppContext';
import { useFeatureToggles } from '@/FeatureToggleContext';
import { links } from '@/Links';

import { AttributionDocumentCardSnippets } from './AttributionDocumentCardSnippets';

interface AttributionDocumentCardActionWrapperProps extends PropsWithChildren {}

interface AttributionDocumentCardBaseProps extends AttributionDocumentCardActionWrapperProps {
    snippets: ReactNode;
    source: ReactNode;
    actions?: ReactNode;
    isSelected?: boolean;
}

const AttributionDocumentCardBase = ({
    snippets,
    source,
    actions,
    isSelected,
}: AttributionDocumentCardBaseProps) => {
    return (
        <Card
            component="li"
            data-selected-document={isSelected}
            sx={{
                bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                        ? theme.palette.background.drawer.primary
                        : theme.palette.background.default,
                listStyle: 'none',
                overflow: 'visible',

                borderLeft: (theme) => `${theme.spacing(1)} solid transparent`,

                '&[data-selected-document="true"]': {
                    borderColor: (theme) => theme.palette.primary.main,
                },
            }}>
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
};

interface AttributionDocumentCardProps {
    source: string;
    documentId: string;
    index?: string | null;
    repeatedDocumentCount?: number;
}

export const AttributionDocumentCard = ({
    source,
    index,
    documentId,
    repeatedDocumentCount,
}: AttributionDocumentCardProps): JSX.Element => {
    const selectRepeatedDocument = useAppContext((state) => state.selectRepeatedDocument);
    const { isDatasetExplorerEnabled } = useFeatureToggles();

    const selectDocument = useAppContext((state) => state.selectDocument);

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

    return (
        <AttributionDocumentCardBase
            snippets={<AttributionDocumentCardSnippets snippets={snippets} />}
            source={`Source: ${source}`}
            isSelected={isSelected}
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
                        onClick={() => {
                            selectDocument(documentId);
                        }}>
                        Locate span{snippets.length > 1 ? 's' : ''}
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
