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
                <Stack direction="row" alignItems="center" gap="0.5ch">
                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ display: 'inline-block' }}>
                        Dolma ID:
                    </Typography>
                    <CopyToClipboardButton
                        buttonContent={<ContentCopyIcon fontSize="inherit" />}
                        text={dolmaId}
                        ariaLabel="Copy Dolma ID">
                        <TruncatableText>{dolmaId}</TruncatableText>
                    </CopyToClipboardButton>
                </Stack>
                <Stack direction="row" alignItems="center" gap="0.5ch">
                    <Typography
                        variant="subtitle1"
                        component="div"
                        fontWeight="bold"
                        sx={{ display: 'inline-block' }}>
                        Source:
                    </Typography>
                    {source}
                </Stack>
            </Stack>
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
