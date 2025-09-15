import { ButtonLink } from '@allenai/varnish-ui';
import { ArrowOutwardOutlined, WysiwygOutlined } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

import { ImageSpinner } from '@/components/ImageSpinner';
import { useQueryContext } from '@/contexts/QueryContext';
import { RemoteState } from '@/contexts/util';

import { LegalNotice } from './LegalNotice/LegalNotice';
import { ThreadMaxWidthContainer } from './ThreadDisplay/ThreadMaxWidthContainer';

export const ThreadPlaceholder = () => {
    const { remoteState, getThreadViewModel } = useQueryContext();
    const selectedModel = getThreadViewModel();
    const isLoading = remoteState === RemoteState.Loading;

    return (
        <Box
            height={1}
            data-testid="thread-placeholder"
            overflow="scroll"
            sx={{
                '@media (prefers-reduced-motion: no-preference)': {
                    scrollBehavior: 'smooth',
                },
                paddingInline: 2,

                // TODO: https://github.com/allenai/olmo-ui/issues/825 Combine this and the ThreadDisplay layout
                overflowY: 'auto',
                overflowX: 'auto',
                scrollbarGutter: 'stable',
            }}>
            <ThreadMaxWidthContainer gridTemplateRows="auto 1fr auto" sx={{ height: '100%' }}>
                <Box gridColumn="2 / -1">
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
                </Box>
                <Typography variant="body1">
                    <br />
                    {/* TODO: This still working text will need to show up at some point when we add the loading states
                    We need  
                */}
                    {/* Still working... */}
                </Typography>
            </ThreadMaxWidthContainer>
        </Box>
    );
};
