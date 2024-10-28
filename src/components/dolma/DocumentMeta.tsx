import { Box, Link, Stack, Typography } from '@mui/material';

interface Props {
    source: string;
    url?: string;
}

export const DocumentMeta = ({ source, url }: Props) => {
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
