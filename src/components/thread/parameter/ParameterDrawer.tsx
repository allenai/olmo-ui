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

import { useEffect } from 'react';

import { useAppContext } from '@/AppContext';
import { ResponsiveDrawer } from '@/components/ResponsiveDrawer';
import { DrawerId } from '@/slices/DrawerSlice';

import { NewModelSelect } from '@/components/NewModelSelect';
import { NewInputSlider } from '@/components/configuration/NewInputSlider';
import { Schema } from '@/api/Schema';
import { ParameterSnackBar } from '@/components/ParameterSnackbar';

export const PARAMETERS_DRAWER_ID: DrawerId = 'parameters' as const;

const MAX_NEW_TOKEN_INFO =
    'Determines the maximum amount of text output from one prompt. Specifying this can help prevent long or irrelevant responses and control costs. One token is approximately 4 characters for standard English text.';

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
    const setIsParameterChanged = useAppContext((state) => state.setIsParameterChanged);
    const handleDrawerClose = () => {
        setIsParameterChanged(false);
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
                break;
            }
        }
    };

    return (
        <ResponsiveDrawer
            onClose={handleDrawerClose}
            open={isDrawerOpen}
            anchor="right"
            desktopDrawerVariant="persistent"
            heading={
                <Box sx={{ position: 'sticky', top: 0 }}>
                    <Stack justifyContent="space-between" direction="row" gap={2}>
                        <ListSubheader sx={{ paddingBlock: 2, backgroundColor: 'transparent' }}>
                            <Typography variant="h5" margin={0} color="primary">
                                Parameters
                            </Typography>
                        </ListSubheader>
                        <IconButton
                            onClick={handleDrawerClose}
                            sx={{
                                verticalAlign: 'middle',
                                display: 'inline-flex',
                                color: 'inherit',
                            }}>
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
                        <NewModelSelect />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <NewInputSlider
                            label="Max New Tokens"
                            min={opts.max_tokens.min}
                            max={opts.max_tokens.max}
                            step={opts.max_tokens.step}
                            initialValue={opts.max_tokens.default}
                            onChange={(v) => updateInferenceOpts({ max_tokens: v })}
                            dialogContent={MAX_NEW_TOKEN_INFO}
                            dialogTitle="Max New Tokens"
                        />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <NewInputSlider
                            label="Temperature"
                            min={opts.temperature.min}
                            max={opts.temperature.max}
                            step={opts.temperature.step}
                            initialValue={opts.temperature.default}
                            onChange={(v) => updateInferenceOpts({ temperature: v })}
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
                            onChange={(v) => updateInferenceOpts({ top_p: v })}
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
                                value={inferenceOpts.stop}
                                freeSolo
                                onChange={(event, value, reason) =>
                                    handleOnChange(event, value, reason)
                                }
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
            <ParameterSnackBar />
        </ResponsiveDrawer>
    );
};
