import { Box, Typography } from '@mui/material';

import { useAppContext } from '@/AppContext';
import { Ai2LogoMarkSpinner } from '@/components/Ai2LogoMarkSpinner';
import { RemoteState } from '@/contexts/util';

import { LegalNotice } from './LegalNotice/LegalNotice';
import { ThreadMaxWidthContainer } from './ThreadDisplay/ThreadMaxWidthContainer';

export const ThreadPlaceholder = () => {
    const isLoading = useAppContext((state) => state.streamPromptState === RemoteState.Loading);

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
                overflowY: 'scroll',
                overflowX: 'auto',
                scrollbarColor: (theme) =>
                    `${theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.light} transparent`,
            }}>
            <ThreadMaxWidthContainer gridTemplateRows="auto 1fr auto" sx={{ height: '100%' }}>
                <Box gridColumn="2 / -1">
                    <LegalNotice />
                </Box>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flex={1}
                    gridColumn="1 / -1">
                    <Ai2LogoMarkSpinner isAnimating={isLoading} width={70} height={70} alt="" />
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
