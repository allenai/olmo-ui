import { Stack } from '@mui/material';

import { useAppContext } from '@/AppContext';
import { Ai2LogoMarkSpinner } from '@/components/Ai2LogoMarkSpinner';
import { RemoteState } from '@/contexts/util';

export const ThreadPlaceholder = () => {
    const isLoading = useAppContext((state) => state.streamPromptState === RemoteState.Loading);
    return (
        <Stack
            marginBlockStart="auto"
            alignSelf="center"
            direction="column"
            justifyContent="center"
            alignItems="center"
            flexGrow={1}
            gap={2}>
            <Ai2LogoMarkSpinner isAnimating={isLoading} width={70} height={70} alt="" />
            {/*
            <Typography variant="body1">
                <br />
                {/* TODO: This still working text will need to show up at some point when we add the loading states
                    We need  
                
                 {* Still working... 
            </Typography>
            */}
        </Stack>
    );
};
