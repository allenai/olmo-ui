import { ButtonLink } from '@allenai/varnish-ui';
import { ArrowOutwardOutlined, WysiwygOutlined } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

import { ImageSpinner } from '@/components/ImageSpinner';
import { ToolCallDisplay } from '@/components/toolCalling/ToolCallDisplay';
import { useQueryContext } from '@/contexts/QueryContext';
import { RemoteState } from '@/contexts/util';

import { LegalNotice } from '../LegalNotice/LegalNotice';
import { ThreadPlaceholderContentWrapper } from './ThreadPlaceholderContentWrapper';

export const ThreadPlaceholder = () => {
    const { remoteState, getThreadViewModel } = useQueryContext();
    const selectedModel = getThreadViewModel();
    const isLoading = remoteState === RemoteState.Loading;

    return (
        <ThreadPlaceholderContentWrapper>
            <Box gridColumn="1/-1">
                <LegalNotice />
            </Box>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                marginBottom={4}
                gap={4}
                flex={1}
                gridColumn="1 / -1">
                <ImageSpinner
                    src="/ai2-monogram.svg"
                    isAnimating={isLoading}
                    width={70}
                    height={70}
                    alt=""
                />
                <Box minHeight={40} textAlign="center">
                    {!!selectedModel?.information_url && (
                        <ButtonLink
                            variant="text"
                            color="primary"
                            href={selectedModel.information_url || undefined}
                            target="_blank"
                            rel="noopener"
                            startIcon={<WysiwygOutlined />}
                            endIcon={<ArrowOutwardOutlined />}>
                            {`Read more about ${selectedModel.name}`}
                        </ButtonLink>
                    )}
                </Box>
                <ToolCallDisplay />
            </Box>
            <Typography variant="body1">
                <br />
                {/* TODO: This still working text will need to show up at some point when we add the loading states
                    We need  
                */}
                {/* Still working... */}
            </Typography>
        </ThreadPlaceholderContentWrapper>
    );
};
