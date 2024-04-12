import { Stack, Typography, styled } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { search } from '../../api/dolma/search';
import { CopyToClipboardButton } from './shared';

interface Props {
    doc: search.Document;
}

export const DocumentMeta = ({ doc }: Props) => {
    return (
        <Stack direction="row" gap={1}>
            <Typography fontSize={14} fontWeight="bold">
                Dolma ID:
            </Typography>
            <CopyToClipboardButton
                buttonContent={<ContentCopyIcon fontSize="inherit" />}
                text={doc.dolma_id}
                ariaLabel="Copy Dolma ID">
                <TruncatableText>&nbsp;{doc.dolma_id}</TruncatableText>
            </CopyToClipboardButton>
            <Typography fontSize={14} fontWeight="bold">
                Source:
            </Typography>
            <Typography component="span" fontSize={14}>
                {doc.source}
            </Typography>
        </Stack>
    );
};

const TruncatableText = styled('span')`
    display: inline-block;
    font-size: 14px;
    vertical-align: top;
    max-width: 9ch;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
