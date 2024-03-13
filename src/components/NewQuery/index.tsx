import { useState, useEffect, useContext, ChangeEvent } from 'react';
import styled from 'styled-components';
import {
    IconButton,
    MenuItem,
    Select,
    Dialog,
    DialogContent,
    LinearProgress,
    Grid,
    Tooltip,
} from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenIconExit from '@mui/icons-material/FullscreenExit';

import { DefaultPromptTemplate, PromptTemplate } from '../../api/PromptTemplate';
import { Confirm } from '../Confirm';
import { MessagePost } from '../../api/Message';
import { useAppContext } from '../../AppContext';
import { Parameters } from '../configuration/Parameters';
import { StandardContainer } from '../StandardContainer';
import { RemoteState } from '../../contexts/util';
import { usePromptTemplate } from '../../contexts/promptTemplateContext';
import { RepromptActionContext } from '../../contexts/repromptActionContext';
import { Model } from '../../api/Model';
import { NewQueryForm } from './NewQueryForm';

export const NewQuery = () => {
    const { modelInfo, postMessage, getAllModel } = useAppContext();

    const { repromptText, setRepromptText } = useContext(RepromptActionContext);

    const [selectedPromptTemplateId, setSelectedPromptTemplateId] = useState<string>(
        DefaultPromptTemplate.id
    );

    const [selectedModelId, setSelectedModelId] = useState<string>('');

    const [isPrivateChecked, setIsPrivateChecked] = useState<boolean>(false);
    const [prompt, setPrompt] = useState<string>();
    // has user edited the prompt
    const [promptIsDirty, setPromptIsDirty] = useState<boolean>(false);
    // should we show the confirm dialog?
    const [isPromptAlertOpen, setIsPromptAlertOpen] = useState(false);
    // id of template we should switch to if the user confirms
    const [promptTemplateIdSwitchingTo, setPromptTemplateIdSwitchingTo] = useState<string>(
        DefaultPromptTemplate.id
    );
    // should we show the content inside a fullscreen dialog?
    const [isFullScreen, setIsFullScreen] = useState(false);

    const [showParams, setShowParams] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // prompt templates
    const {
        remoteState: promptTemplateRemoteState,
        promptTemplateList,
        getPromptTemplateList,
    } = usePromptTemplate();
    const [promptTemplates, setPromptTemplates] = useState<PromptTemplate[]>([
        DefaultPromptTemplate,
    ]);
    const [modelList, setModelList] = useState<Model[]>([]);
    const [promptTemplatesLoading, setPromptTemplatesLoading] = useState(
        promptTemplateRemoteState === RemoteState.Loading
    );
    const [modelLoading, setModelLoading] = useState(false);
    const getPromptTemplates = async function () {
        setPromptTemplatesLoading(true);
        getPromptTemplateList().finally(() => {
            setPromptTemplatesLoading(false);
        });
    };

    const getModelList = async function () {
        setModelLoading(true);
        getAllModel().finally(() => {
            setModelLoading(false);
        });
    };

    // force a rerender with default data and load new thread
    const Clear = () => {
        setPrompt('');
        setPromptIsDirty(false);
        setIsFullScreen(false);
        setSelectedPromptTemplateId(DefaultPromptTemplate.id);
    };

    // see if any loading state is active
    const isLoading =
        isSubmitting ||
        promptTemplatesLoading ||
        modelLoading ||
        promptTemplateRemoteState === RemoteState.Loading;

    // on load fetch data
    useEffect(() => {
        getPromptTemplates();
        getModelList();
    }, []);

    useEffect(() => {
        promptTemplateList.sort((a, b) => a.name.localeCompare(b.name));
        setPromptTemplates([DefaultPromptTemplate].concat(promptTemplateList));
    }, [promptTemplateList]);

    const postNewMessage = async function () {
        setIsSubmitting(true);
        const payload: MessagePost = {
            content: prompt || '',
            private: isPrivateChecked,
            model: selectedModelId,
        };
        const postMessageInfo = await postMessage(payload);
        if (!postMessageInfo.loading && postMessageInfo.data && !postMessageInfo.error) {
            Clear();
        }
        setIsSubmitting(false);
        if (repromptText.length !== 0) {
            setRepromptText('');
        }
    };

    // when a selected prompt changes, update the user prompt
    useEffect(() => {
        const foundPrompt = promptTemplates?.find((p) => p.id === selectedPromptTemplateId);
        setPrompt(foundPrompt?.content);
    }, [selectedPromptTemplateId]);

    const updatePrompt = (value?: string, setDirty: boolean = true) => {
        setPrompt(value);
        if (value && value.length !== 0) {
            setPromptIsDirty(setDirty);
        }
    };

    const onPrivateCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        setIsPrivateChecked(event.target.checked);
    };

    useEffect(() => {
        updatePrompt(repromptText);
    }, [repromptText]);

    useEffect(() => {
        if (modelInfo.data) {
            const modelList = modelInfo.data;
            setModelList(modelList);
            setSelectedModelId(modelList[0].id);
        }
    }, [modelInfo]);

    return (
        <StandardContainer>
            <FullScreenCapableContainer isFullScreen={isFullScreen}>
                <Grid
                    display="grid"
                    gap={2}
                    height={1}
                    gridTemplateRows="min-content 1fr min-content">
                    <Grid container item gap={2} justifyContent="space-between">
                        <Tooltip
                            title={
                                modelList.find((model) => model.id === selectedModelId)?.description
                            }
                            placement="top">
                            <Select
                                sx={{
                                    flex: '1 1 min-content',
                                }}
                                value={selectedModelId}
                                disabled={isLoading}
                                onChange={(evt) => {
                                    setSelectedModelId(evt.target.value);
                                }}>
                                {modelList.map((ml) => {
                                    return (
                                        <MenuItem key={ml.id} value={ml.id}>
                                            {ml.name}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </Tooltip>

                        <Select
                            defaultValue={DefaultPromptTemplate.id}
                            value={selectedPromptTemplateId}
                            disabled={isLoading}
                            sx={{
                                flex: '1 1 min-content',
                            }}
                            onChange={(evt) => {
                                if (promptIsDirty) {
                                    // we have a dirty prompt, prevent the change?
                                    setPromptTemplateIdSwitchingTo(evt.target.value);
                                    setIsPromptAlertOpen(true);
                                } else {
                                    setSelectedPromptTemplateId(evt.target.value);
                                }
                            }}>
                            {promptTemplates.map((pt) => {
                                return (
                                    <MenuItem key={pt.id} value={pt.id}>
                                        {pt.name}
                                    </MenuItem>
                                );
                            })}
                        </Select>
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
                    </Grid>
                    <NewQueryForm
                        isFormDisabled={isLoading}
                        onPromptChange={(event) => updatePrompt(event.target.value)}
                        onSubmit={(event) => postNewMessage()}
                        onParametersButtonClick={() => setShowParams(!showParams)}
                    />
                    {isLoading ? (
                        <Grid>
                            <LinearProgress />
                        </Grid>
                    ) : null}
                    <Confirm
                        title="Lose changes?"
                        contentText="You have prompt edits that will be lost if you continue."
                        open={isPromptAlertOpen}
                        onSuccess={() => {
                            setIsPromptAlertOpen(false);
                            setSelectedPromptTemplateId(promptTemplateIdSwitchingTo);
                        }}
                        onCancel={() => setIsPromptAlertOpen(false)}
                        successText="Continue"
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
