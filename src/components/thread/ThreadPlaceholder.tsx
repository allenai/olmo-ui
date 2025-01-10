import { Box } from '@mui/material';

import { useAppContext } from '@/AppContext';
import { Ai2LogoMarkSpinner } from '@/components/Ai2LogoMarkSpinner';
import { RemoteState } from '@/contexts/util';

import { ThreadDisplayWrapper } from './ThreadDisplay/ThreadDisplayWrapper';

export const ThreadPlaceholder = () => {
    const isLoading = useAppContext((state) => state.streamPromptState === RemoteState.Loading);

    return (
        <ThreadDisplayWrapper>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flex={1}
                gridColumn="1 / -1">
                <Ai2LogoMarkSpinner isAnimating={isLoading} width={70} height={70} alt="" />
            </Box>
        </ThreadDisplayWrapper>
    );
};
