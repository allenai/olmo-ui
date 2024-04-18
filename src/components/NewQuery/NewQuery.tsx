import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenIconExit from '@mui/icons-material/FullscreenExit';
import { Dialog, DialogContent, Grid, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';

import { useAppContext } from '../../AppContext';
import { MessagePost } from '../../api/Message';
import { RemoteState } from '../../contexts/util';
import { StandardContainer } from '../StandardContainer';
import { Parameters } from '../configuration/Parameters';
import { NewQueryForm } from './NewQueryForm';
import { analyticsClient } from '@/api/AnalyticsClient';

export const NewQuery = () => {
    const modelRemoteState = useAppContext((state) => state.modelRemoteState);
    const postMessage = useAppContext((state) => state.postMessage);
    const getAllModels = useAppContext((state) => state.getAllModels);

    // should we show the content inside a fullscreen dialog?
    const [isFullScreen, setIsFullScreen] = useState(false);

    const [showParams, setShowParams] = useState(false);

    const promptTemplateRemoteState = useAppContext((state) => state.promptTemplateListRemoteState);
    const getPromptTemplateList = useAppContext((state) => state.getPromptTemplateList);

    // see if any loading state is active
    const isLoading =
        modelRemoteState === RemoteState.Loading ||
        promptTemplateRemoteState === RemoteState.Loading;

    // on load fetch data
    useEffect(() => {
        getPromptTemplateList();
        getAllModels();
    }, []);

    const postNewMessage = async function (data: MessagePost) {
        analyticsClient.trackNewPrompt({ content: data.content });
        await postMessage(data);
    };

    return (
        <StandardContainer>
            <FullScreenCapableContainer isFullScreen={isFullScreen}>
                <Grid gap={2} height={1}>
                    <NewQueryForm
                        isFormDisabled={isLoading}
                        onSubmit={(formData) => postNewMessage(formData)}
                        onParametersButtonClick={() => setShowParams(!showParams)}
                        topRightFormControls={
                            <IconButton
                                size="large"
                                onClick={() => setIsFullScreen(!isFullScreen)}
                                sx={{ marginLeft: 'auto' }}>
                                {!isFullScreen ? (
                                    <FullscreenIcon fontSize="inherit" />
                                ) : (
                                    <FullscreenIconExit fontSize="inherit" />
                                )}
                            </IconButton>
                        }
                    />
                    {showParams ? (
                        <Grid minWidth="300px">
                            <Parameters />
                        </Grid>
                    ) : null}
                </Grid>
            </FullScreenCapableContainer>
        </StandardContainer>
    );
};

// wrap children in a full screen modal dialog or not
const FullScreenCapableContainer = ({
    isFullScreen,
    children,
}: {
    isFullScreen?: boolean;
    children: JSX.Element;
}) => {
    if (isFullScreen) {
        return (
            <Dialog sx={{ padding: 2 }} open fullScreen>
                <DialogContent>{children}</DialogContent>
            </Dialog>
        );
    }
    return <>{children}</>;
};
