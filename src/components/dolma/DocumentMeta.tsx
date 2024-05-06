import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Box, Stack, styled, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

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
                    <Link to={url}>
                        <Typography
                            sx={{
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                            }}
                            variant="subtitle1"
                            component="div"
                            color={(theme) => theme.color.B6.hex}>
                            {url}
                        </Typography>
                    </Link>
                </Box>
            )}
            <Typography noWrap variant="subtitle1" component="div" sx={{ flexShrink: 0 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'inline-block' }}>
                    Dolma ID:&nbsp;&nbsp;
                </Typography>
                <CopyToClipboardButton
                    buttonContent={<ContentCopyIcon fontSize="inherit" />}
                    text={dolmaId}
                    ariaLabel="Copy Dolma ID">
                    <TruncatableText>&nbsp;{dolmaId}</TruncatableText>
                </CopyToClipboardButton>
                <Typography
                    variant="subtitle1"
                    component="div"
                    fontWeight="bold"
                    sx={{ display: 'inline-block' }}>
                    Source:&nbsp;
                </Typography>
                {source}
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
