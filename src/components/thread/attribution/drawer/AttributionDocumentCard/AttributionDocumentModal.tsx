import CloseIcon from '@mui/icons-material/Close';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import { Button, DialogTitle, IconButton, Snackbar, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { Document } from '@/api/AttributionClient';
import { StandardModal } from '@/components/StandardModal';

import { BoldTextForDocumentAttribution } from './BoldTextForDocumentAttribution';
import { deduceUsageFromSource, prettifySource } from './SourcePrettifier';

export const ShareButton = ({ url, onClick }: { url: string; onClick?: () => void }) => {
    const [open, setOpen] = useState(false);
    if (!url) {
        return null;
    }

    return (
        <>
            <Button
                title="Share"
                variant="outlined"
                onClick={() => {
                    if (onClick) {
                        onClick();
                    }
                    navigator.clipboard.writeText(url);
                    setOpen(true);
                }}
                startIcon={<ShareOutlinedIcon />}>
                Share
            </Button>
            <Snackbar
                open={open}
                autoHideDuration={2500}
                onClose={() => {
                    setOpen(false);
                }}
                message="Link copied to clipboard"
            />
        </>
    );
};

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
    const correspondingSpans = document.snippets.map((snippet) => snippet.corresponding_span_text);

    return (
        <StandardModal
            open={open}
            onClose={handleClose}
            data-testid="attribution-document-modal"
            sx={{ borderRadius: '20px', padding: '30px 50px 50px 50px' }}>
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
            <>
                <DialogTitle variant="h4" sx={{ paddingInline: 0 }}>
                    <Typography variant="h4" fontWeight={600} component="span">
                        {deduceUsageFromSource(document.source)} document from:&nbsp;
                    </Typography>
                    <Typography variant="h4" component="span">
                        {prettifySource(document.source)}
                    </Typography>
                </DialogTitle>
                <Stack pt={3.5} gap={2.5}>
                    {!!document.url && (
                        <Typography variant="h4" color="primary">
                            {document.url}
                        </Typography>
                    )}
                    <BoldTextForDocumentAttribution
                        correspondingSpans={correspondingSpans}
                        text={document.text_long}
                        lineBreak={true}
                    />
                </Stack>
            </>
        </StandardModal>
    );
};
