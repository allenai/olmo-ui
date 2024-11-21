import { Box, Typography } from '@mui/material';

import { useAppContext } from '@/AppContext';
import { Ai2LogoMarkSpinner } from '@/components/Ai2LogoMarkSpinner';
import { RemoteState } from '@/contexts/util';

import { LegalNotice } from './LegalNotice';
import { ThreadMaxWidthContainer } from './ThreadDisplay/ThreadMaxWidthContainer';

export const ThreadPlaceholder = () => {
    const isLoading = useAppContext((state) => state.streamPromptState === RemoteState.Loading);

    return (
        <ThreadMaxWidthContainer gridTemplateRows="auto 1fr auto">
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
    );
};
