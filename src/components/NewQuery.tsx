import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
    Button,
    IconButton,
    MenuItem,
    Select,
    Dialog,
    DialogContent,
    LinearProgress,
    Grid,
    TextField,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenIconExit from '@mui/icons-material/FullscreenExit';

import { DefaultPromptTemplate, PromptTemplate } from '../api/PromptTemplate';
import { Confirm } from './Confirm';
import { MessagePost } from '../api/Message';
import { useAppContext } from '../AppContext';
import { Parameters } from './configuration/Parameters';
import { StandardContainer } from './StandardContainer';
import { useDataChip } from '../contexts/dataChipContext';
import { RemoteState } from '../contexts/util';
import { usePromptTemplate } from '../contexts/promptTemplateContext';
import { RepromptActionContext } from '../contexts/repromptActionContext';

export const NewQuery = () => {
    const { postMessage } = useAppContext();

    const { repromptText, setRepromptText } = React.useContext(RepromptActionContext);

    const [selectedPromptTemplateId, setSelectedPromptTemplateId] = useState<string>(
        DefaultPromptTemplate.id
    );

    const [checked, setChecked] = React.useState<boolean>(false);
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

    // datachips
    const { remoteState: dataChipRemoteState, getDataChipList } = useDataChip();
    const [dataChipsLoading, setDataChipsLoading] = useState(
        dataChipRemoteState === RemoteState.Loading
    );
    const getDataChips = async function () {
        setDataChipsLoading(true);
        getDataChipList().finally(() => {
            setDataChipsLoading(false);
        });
    };

    // prompt templates
    const {
        remoteState: promptTemplateRemoteState,
        promptTemplateList,
        getPromptTemplateList,
    } = usePromptTemplate();
    const [promptTemplates, setPromptTemplates] = useState<PromptTemplate[]>([
        DefaultPromptTemplate,
    ]);
    const [promptTemplatesLoading, setPromptTemplatesLoading] = useState(
        promptTemplateRemoteState === RemoteState.Loading
    );
    const getPromptTemplates = async function () {
        setPromptTemplatesLoading(true);
        getPromptTemplateList().finally(() => {
            setPromptTemplatesLoading(false);
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
        promptTemplateRemoteState === RemoteState.Loading ||
        dataChipsLoading ||
        dataChipRemoteState === RemoteState.Loading;

    // on load fetch data
    useEffect(() => {
        getPromptTemplates();
        getDataChips();
    }, []);

    useEffect(() => {
        promptTemplateList.sort((a, b) => a.name.localeCompare(b.name));
        setPromptTemplates([DefaultPromptTemplate].concat(promptTemplateList));
    }, [promptTemplateList]);

    const postNewMessage = async function () {
        setIsSubmitting(true);
        const payload: MessagePost = {
            content: prompt || '',
            private: checked,
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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };

    useEffect(() => {
        updatePrompt(repromptText);
    }, [repromptText]);

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
                                    onClick={() => setIsFullScreen(!isFullScreen)}>
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
                            <ButtonArea>
                                <Button
                                    variant="contained"
                                    onClick={() => postNewMessage()}
                                    disabled={isLoading}>
                                    Prompt
                                </Button>
                                <span />
                                <FormControlLabel
                                    sx={{ marginLeft: 'auto' }}
                                    control={<Checkbox checked={checked} onChange={handleChange} />}
                                    label="Private"
                                />
                                <Button
                                    variant="outlined"
                                    onClick={() => setShowParams(!showParams)}>
                                    Parameters
                                </Button>
                            </ButtonArea>
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
    grid-template-columns: minmax(300px, 50%) 1fr 56px;
`;

const ButtonArea = styled.div`
    display: flex;
    justify-content: center;
`;
