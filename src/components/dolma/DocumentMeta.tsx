import { Stack, styled } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { search } from '../../api/dolma/search';
import { CopyToClipboardButton } from './shared';

interface Props {
    doc: search.Document;
}

export const DocumentMeta = ({ doc }: Props) => {
    return (
        <Stack direction="row" gap="6px" sx={{ fontSize: '14px' }}>
            <strong>Dolma ID:&nbsp;</strong>
            <CopyToClipboardButton
                buttonContent={<ContentCopyIcon fontSize="inherit" />}
                text={doc.dolma_id}
                ariaLabel="Copy Dolma ID">
                <TruncatableText>&nbsp;{doc.dolma_id}</TruncatableText>
            </CopyToClipboardButton>
            <strong>Source:&nbsp;</strong> {doc.source}
        </Stack>
    );
};

const TruncatableText = styled('span')`
    display: inline-block;
    vertical-align: top;
    max-width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
