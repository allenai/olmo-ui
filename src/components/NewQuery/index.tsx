import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenIconExit from '@mui/icons-material/FullscreenExit';
import { Dialog, DialogContent, Grid, IconButton, LinearProgress } from '@mui/material';
import { useEffect, useState } from 'react';

import { useAppContext } from '../../AppContext';
import { MessagePost } from '../../api/Message';
import { usePromptTemplate } from '../../contexts/promptTemplateContext';
import { RemoteState } from '../../contexts/util';
import { StandardContainer } from '../StandardContainer';
import { Parameters } from '../configuration/Parameters';
import { NewQueryForm } from './NewQueryForm';

export const NewQuery = () => {
    const { modelInfo, postMessage, getAllModel } = useAppContext();

    // should we show the content inside a fullscreen dialog?
    const [isFullScreen, setIsFullScreen] = useState(false);

    const [showParams, setShowParams] = useState(false);

    // prompt templates
    const {
        remoteState: promptTemplateRemoteState,
        promptTemplateList,
        getPromptTemplateList,
    } = usePromptTemplate();

    // see if any loading state is active
    const isLoading =
        modelInfo.loading ||
        !modelInfo.data?.length ||
        promptTemplateRemoteState === RemoteState.Loading;

    // on load fetch data
    useEffect(() => {
        getPromptTemplateList();
        getAllModel();
    }, []);

    const postNewMessage = async function (data: MessagePost) {
        await postMessage(data);
    };

    // // when a selected prompt changes, update the user prompt
    // useEffect(() => {
    //     const foundPrompt = promptTemplates?.find((p) => p.id === selectedPromptTemplateId);
    //     setPrompt(foundPrompt?.content);
    // }, [selectedPromptTemplateId]);

    // const updatePrompt = (value?: string, setDirty: boolean = true) => {
    //     setPrompt(value);
    //     if (value && value.length !== 0) {
    //         setPromptIsDirty(setDirty);
    //     }
    // };

    // useEffect(() => {
    //     if (modelInfo.data) {
    //         const modelList = modelInfo.data;
    //         setModelList(modelList);
    //         setSelectedModelId(modelList[0]?.id);
    //     }
    // }, [modelInfo]);

    return (
        <StandardContainer>
            <FullScreenCapableContainer isFullScreen={isFullScreen}>
                <Grid display="grid" gap={2} height={1} gridTemplateRows="min-content 1fr">
                    {isLoading ? (
                        <Grid>
                            <LinearProgress />
                        </Grid>
                    ) : (
                        <NewQueryForm
                            isFormDisabled={isLoading}
                            onSubmit={(event) => postNewMessage(event)}
                            onParametersButtonClick={() => setShowParams(!showParams)}
                            promptTemplates={promptTemplateList}
                            models={modelInfo.data!}
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
                    )}
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
