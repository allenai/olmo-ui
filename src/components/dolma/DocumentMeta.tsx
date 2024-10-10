import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Box, Link, Stack, styled, Typography } from '@mui/material';

import { CopyToClipboardButton } from './shared';

interface Props {
    dolmaId: string;
    source: string;
    url?: string;
}

export const DocumentMeta = ({ dolmaId, source, url }: Props) => {
    return (
        <Stack direction="row" gap={1} flexWrap="wrap">
            {!!url && (
                <Box sx={{ minWidth: '0' }}>
                    <Link
                        href={url}
                        sx={{
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                        }}
                        variant="subtitle1">
                        {url}
                    </Link>
                </Box>
            )}
            <Stack direction="row" gap={1} alignItems="center">
                <Stack direction="row" alignItems="center">
                    <Typography variant="h5" component="div" fontWeight="bold">
                        <strong>Dolma ID:</strong>&nbsp;
                    </Typography>
                    <CopyToClipboardButton
                        buttonContent={<ContentCopyIcon fontSize="inherit" />}
                        text={dolmaId}
                        ariaLabel="Copy Dolma ID">
                        <TruncatableText variant="body1">{dolmaId}</TruncatableText>
                    </CopyToClipboardButton>
                </Stack>
                <Stack direction="row" alignItems="center">
                    <Typography variant="h5" component="div" fontWeight="bold">
                        <strong>Source</strong>:&nbsp;
                    </Typography>
                    <Typography variant="body1" component="div">
                        {source}
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    );
};

const TruncatableText = styled(Typography)`
    max-width: 9ch;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
