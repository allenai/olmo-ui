import CloseIcon from '@mui/icons-material/Close';
import {
    Autocomplete,
    AutocompleteChangeReason,
    Box,
    Chip,
    Divider,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListSubheader,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { KeyboardEventHandler, useEffect, useState } from 'react';

import { Schema } from '@/api/Schema';
import { useAppContext } from '@/AppContext';
import { NewInputSlider } from '@/components/configuration/NewInputSlider';
import { NewModelSelect } from '@/components/NewModelSelect';
import { ParameterSnackBar } from '@/components/ParameterSnackBar';
import { ResponsiveDrawer } from '@/components/ResponsiveDrawer';
import { DrawerId } from '@/slices/DrawerSlice';

export const PARAMETERS_DRAWER_ID: DrawerId = 'parameters';

const TEMPERATURE_INFO =
    'Temperature controls the degree of randomness. Lower temperatures are suitable for prompts that expect accuracy and reliability, while higher temperatures lead to more diverse or creative results. The model will become repetitive as the temperature approaches zero.';

const TOP_P_INFO =
    'Top-p controls how the model selects tokens for output. It sets a probability threshold and selects tokens from most probable to least until the combined probability reaches this threshold. A lower value is suitable for factual answers while a higher one leads to more diverse output.';

interface ParameterDrawerProps {
    schemaData: Schema;
}
export const ParameterDrawer = ({ schemaData }: ParameterDrawerProps): JSX.Element => {
    const closeDrawer = useAppContext((state) => state.closeDrawer);
    const inferenceOpts = useAppContext((state) => state.inferenceOpts);
    const updateInferenceOpts = useAppContext((state) => state.updateInferenceOpts);
    const getAllModels = useAppContext((state) => state.getAllModels);
    const isDrawerOpen = useAppContext((state) => state.currentOpenDrawer === PARAMETERS_DRAWER_ID);
    const [parametersChanged, setParametersChanged] = useState(false);
    const handleDrawerClose = () => {
        setParametersChanged(false);
        closeDrawer(PARAMETERS_DRAWER_ID);
    };

    useEffect(() => {
        // on load fetch data
        getAllModels();
    }, []);

    const opts = schemaData.Message.InferenceOpts;

    const handleOnChange = (
        _event: React.SyntheticEvent,
        value: string[],
        reason: AutocompleteChangeReason
    ) => {
        switch (reason) {
            default: {
                const uniqueStopWords = Array.from(new Set(value).values());
                updateInferenceOpts({ stop: uniqueStopWords });
                setParametersChanged(true);
                break;
            }
        }
    };

    const onKeyDownEscapeHandler: KeyboardEventHandler = (
        event: React.KeyboardEvent<HTMLDivElement>
    ) => {
        if (event.key === 'Escape') {
            handleDrawerClose();
        }
    };

    return (
        <ResponsiveDrawer
            onClose={handleDrawerClose}
            onKeyDownHandler={onKeyDownEscapeHandler}
            open={isDrawerOpen}
            anchor="right"
            desktopDrawerVariant="persistent"
            heading={
                <Box
                    sx={{
                        position: 'sticky',
                        top: 0,
                        background: 'inherit',
                        zIndex: 1,
                    }}>
                    <Stack
                        justifyContent="space-between"
                        direction="row"
                        gap={2}
                        alignItems="center">
                        <ListSubheader sx={{ paddingBlock: 2, backgroundColor: 'transparent' }}>
                            <Typography variant="h5" margin={0} color="primary">
                                Parameters
                            </Typography>
                        </ListSubheader>
                        <IconButton onClick={handleDrawerClose} sx={{ color: 'inherit' }}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                    <Divider />
                </Box>
            }
            desktopDrawerSx={{ gridArea: 'side-drawer' }}>
            <Stack component="nav" direction="column" justifyContent="space-between" height="1">
                <List>
                    <ListItem>
                        <InputLabel>Model</InputLabel>
                    </ListItem>
                    <ListItem>
                        <NewModelSelect setParametersChanged={setParametersChanged} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <NewInputSlider
                            label="Temperature"
                            min={opts.temperature.min}
                            max={opts.temperature.max}
                            step={opts.temperature.step}
                            initialValue={opts.temperature.default}
                            onChange={(v) => {
                                updateInferenceOpts({ temperature: v });
                                setParametersChanged(true);
                            }}
                            dialogContent={TEMPERATURE_INFO}
                            dialogTitle="Temperature"
                        />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <NewInputSlider
                            label="Top P"
                            min={opts.top_p.min}
                            max={opts.top_p.max}
                            step={opts.top_p.step}
                            initialValue={opts.top_p.default}
                            onChange={(v) => {
                                updateInferenceOpts({ top_p: v });
                                setParametersChanged(true);
                            }}
                            dialogContent={TOP_P_INFO}
                            dialogTitle="Top P"
                        />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <Box sx={{ width: '100%' }}>
                            <Autocomplete
                                multiple
                                options={inferenceOpts.stop ?? []}
                                value={inferenceOpts.stop ?? []}
                                freeSolo
                                onChange={(event, value, reason) => {
                                    handleOnChange(event, value, reason);
                                }}
                                renderTags={(stopWords: readonly string[], getTagProps) =>
                                    stopWords.map((option: string, index: number) => (
                                        // getTagProps already included a key but eslint doesnt know about it.
                                        // eslint-disable-next-line react/jsx-key
                                        <Chip label={option} {...getTagProps({ index })} />
                                    ))
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Stop Words"
                                        placeholder="Enter Stop Word"
                                        helperText={
                                            <Typography variant="caption">
                                                Press &quot;Enter&quot; to add a new word.
                                            </Typography>
                                        }
                                    />
                                )}
                            />
                        </Box>
                    </ListItem>
                </List>
            </Stack>
            <ParameterSnackBar
                parametersChanged={parametersChanged}
                setParametersChanged={setParametersChanged}
            />
        </ResponsiveDrawer>
    );
};
