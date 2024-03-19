import { useState, useEffect } from 'react';
import * as React from 'react';
import styled from 'styled-components';
import {
    IconButton,
    MenuItem,
    Select,
    Dialog,
    DialogContent,
    LinearProgress,
    Grid,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Tooltip,
} from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenIconExit from '@mui/icons-material/FullscreenExit';

import { DefaultPromptTemplate, PromptTemplate } from '../api/PromptTemplate';
import { Confirm } from './Confirm';
import { MessagePost } from '../api/Message';
import { useAppContext } from '../AppContext';
import { Parameters } from './configuration/Parameters';
import { StandardContainer } from './StandardContainer';
import { RemoteState } from '../contexts/util';
import { usePromptTemplate } from '../contexts/promptTemplateContext';
import { RepromptActionContext } from '../contexts/repromptActionContext';
import { Model } from '../api/Model';

export const NewQuery = () => {
    const { modelInfo, postMessage, getAllModels } = useAppContext();

    const { repromptText, setRepromptText } = React.useContext(RepromptActionContext);

    const [selectedPromptTemplateId, setSelectedPromptTemplateId] = useState<string>(
        DefaultPromptTemplate.id
    );

    const [selectedModelId, setSelectedModelId] = useState<string>('');

    const [isPrivateChecked, setIsPrivateChecked] = React.useState<boolean>(false);
    const [prompt, setPrompt] = useState<string>();
    // has user edited the prompy
    const [promptIsDirty, setPromptIsDirty] = useState<boolean>(false);
    // should we show the confirm dialog?
    const [isPromptAlertOpen, setIsPromptAlertOpen] = React.useState(false);
    // id of template we should switch to if the user confirms
    const [promptTemplateIdSwitchingTo, setPromptTemplateIdSwitchingTo] = useState<string>(
        DefaultPromptTemplate.id
    );
    // should we show the content inside a fullscreen dialog?
    const [isFullScreen, setIsFullScreen] = React.useState(false);

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
        getAllModels().finally(() => {
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

    const onPrivateCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
                    gridTemplateColumns="1fr min-content"
                    sx={{ height: '100%' }}>
                    <Grid display="grid" gap={1} gridTemplateRows="min-content 1fr min-content">
                        <Grid>
                            <TemplateArea>
                                <Tooltip
                                    title={
                                        modelList.find((model) => model.id === selectedModelId)
                                            ?.description
                                    }
                                    placement="top">
                                    <Select
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
                                <span />
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
                            </TemplateArea>
                        </Grid>

                        <Grid>
                            <TextField
                                fullWidth
                                multiline
                                minRows={10}
                                disabled={isLoading}
                                placeholder="Select a Prompt Template above or type a free form prompt"
                                value={prompt}
                                inputRef={(input) => {
                                    if (repromptText.length !== 0 && input !== null) {
                                        input.focus();
                                    }
                                }}
                                onChange={(v) => updatePrompt(v.target.value)}
                                style={{ height: '100%' }}
                                InputProps={{
                                    sx: {
                                        height: '100%',
                                        alignItems: 'flex-start',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid>
                            <Grid display="flex" justifyContent="center">
                                <Button
                                    variant="contained"
                                    onClick={() => postNewMessage()}
                                    disabled={isLoading}>
                                    Prompt
                                </Button>
                                <span />
                                <FormControlLabel
                                    sx={{ marginLeft: 'auto' }}
                                    control={
                                        <Checkbox
                                            checked={isPrivateChecked}
                                            onChange={(e) => onPrivateCheckboxChange(e)}
                                            inputProps={{
                                                'aria-label': 'Mark this Query Private',
                                            }}
                                        />
                                    }
                                    label="Private"
                                />
                                <Button
                                    variant="outlined"
                                    onClick={() => setShowParams(!showParams)}>
                                    Parameters
                                </Button>
                            </Grid>
                        </Grid>
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
                    </Grid>
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
            <PaddedDialog open fullScreen>
                <DialogContent>{children}</DialogContent>
            </PaddedDialog>
        );
    }
    return <>{children}</>;
};

const PaddedDialog = styled(Dialog)`
    padding: ${({ theme }) => theme.spacing(2)};
`;

const TemplateArea = styled.div`
    display: grid;
    grid-auto-flow: column;
    grid-gap: 10px;
    grid-template-columns: minmax(300px, 50%) minmax(300px, 50%) 56px;
`;
