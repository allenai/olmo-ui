import { Box, Link, Stack, Typography } from '@mui/material';

import { Document } from '@/api/AttributionClient';
import {
    StandardDialogCloseButton,
    StandardDialogTitle,
    StandardModal,
} from '@/components/StandardModal';
import { useFeatureToggles } from '@/FeatureToggleContext';
import { links } from '@/Links';

import { BoldTextForDocumentAttribution } from './BoldTextForDocumentAttribution';
import { prettifySource } from './SourcePrettifier';

interface AttributionDocumentModalProps {
    document: Document;
    open: boolean;
    closeModal: () => void;
}

export const AttributionDocumentModal = ({
    document,
    open,
    closeModal: handleClose,
}: AttributionDocumentModalProps) => {
    const { isDatasetExplorerEnabled } = useFeatureToggles();
    // we'd like to make spans bold on the text in the modal
    const correspondingSpans = document.snippets.map((snippet) => snippet.corresponding_span_text);

    return (
        <StandardModal open={open} onClose={handleClose} data-testid="attribution-document-modal">
            <StandardDialogTitle>
                <Box
                    sx={{
                        paddingInlineEnd: 6,
                    }}>
                    <Typography variant="h4" fontWeight={600} component="span">
                        {document.usage} document from:&nbsp;
                    </Typography>
                    <Typography variant="h4" component="span">
                        {prettifySource(document)}
                    </Typography>
                </Box>
                {!!document.url && (
                    <Typography variant="body1" component="span" pt={1}>
                        <Typography component="span">URL:&nbsp;</Typography>
                        <Link
                            href={document.url}
                            target="_blank"
                            color="primary"
                            sx={{ wordBreak: 'break-word' }}>
                            {document.url}
                        </Link>
                    </Typography>
                )}
                <StandardDialogCloseButton onClick={handleClose} />
            </StandardDialogTitle>
            <Stack pt={2} gap={3.5} sx={{ overflowY: 'scroll' }}>
                <BoldTextForDocumentAttribution
                    correspondingSpans={correspondingSpans}
                    text={document.text_long}
                    lineBreak={true}
                />
            </Stack>
            {isDatasetExplorerEnabled && (
                // TODO: Pass the dataset index we want to use into this
                <Link href={links.document(document.index) + '?isDatasetExplorerEnabled=true'}>
                    View in Dataset Explorer
                </Link>
            )}
        </StandardModal>
    );
};
