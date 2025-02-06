import CloseIcon from '@mui/icons-material/Close';
import { Box, DialogTitle, IconButton, Link, Stack, Typography } from '@mui/material';

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
            <DialogTitle sx={{ paddingInline: 0 }} display="flex" flexDirection="column">
                <Box>
                    <Typography variant="h4" fontWeight={600} component="span">
                        {deduceUsageFromSource(document.source)} document from:&nbsp;
                    </Typography>
                    <Typography variant="h4" component="span">
                        {prettifySource(document.source)}
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
            </DialogTitle>
            <Stack pt={2} gap={3.5} sx={{ overflowY: 'scroll' }}>
                <BoldTextForDocumentAttribution
                    correspondingSpans={correspondingSpans}
                    text={document.text_long}
                    lineBreak={true}
                />
            </Stack>
        </StandardModal>
    );
};
