import CloseIcon from '@mui/icons-material/Close';
import { DialogTitle, IconButton, Link, Stack, Typography } from '@mui/material';

import { Document } from '@/api/AttributionClient';
import { StandardModal } from '@/components/StandardModal';

import { BoldTextForDocumentAttribution } from './BoldTextForDocumentAttribution';
import { deduceUsageFromSource, prettifySource } from './SourcePrettifier';

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
    // we'd like to make spans bold on the text in the modal
    const correspondingSpans = document.snippets.map((snippet) => snippet.corresponding_span_text);

    return (
        <StandardModal
            open={open}
            onClose={handleClose}
            data-testid="attribution-document-modal"
            sx={{ overflowY: 'unset', padding: '30px 50px 50px 50px', borderRadius: '20px' }}>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={(theme) => ({
                    position: 'absolute',
                    right: 25,
                    top: 25,
                    color: theme.palette.grey[500],
                })}>
                <CloseIcon />
            </IconButton>
            <DialogTitle variant="h4" sx={{ paddingInline: 0 }}>
                <Typography variant="h4" fontWeight={600} component="span">
                    {deduceUsageFromSource(document.source)} document from:&nbsp;
                </Typography>
                <Typography variant="h4" component="span">
                    {prettifySource(document.source)}
                </Typography>
            </DialogTitle>
            <Stack pt={1} gap={3.5} sx={{ overflowY: 'scroll' }}>
                {!!document.url && (
                    <Typography variant="body1" component="span">
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
                <BoldTextForDocumentAttribution
                    correspondingSpans={correspondingSpans}
                    text={document.text_long}
                    lineBreak={true}
                />
            </Stack>
        </StandardModal>
    );
};
