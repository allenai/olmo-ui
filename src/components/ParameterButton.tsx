import {
    Autocomplete,
    Box,
    Button,
    Chip,
    Divider,
    IconButton,
    InputLabel,
    List,
    ListItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';

import { ResponsiveDrawer } from './ResponsiveDrawer';
import { NavigationHeading } from './OlmoAppBar/NavigationHeading';
import { ModelSelect } from './NewQuery/ModelSelect';
import { useAppContext } from '../AppContext';
import { NewInputSlider } from './configuration/NewInputSlider';

const MAX_NEW_TOKEN_INFO =
    'Determines the maximum amount of text output from one prompt. Specifying this can help prevent long or irrelevant responses and control costs. One token is approximately 4 characters for standard English text.';

const TEMPERATURE_INFO =
    'Temperature controls the degree of randomness. Lower temperatures are suitable for prompts that expect accuracy and reliability, while higher temperatures lead to more diverse or creative results. The model will become repetitive as the temperature approaches zero.';

const TOP_P_INFO =
    'Top-p controls how the model selects tokens for output. It sets a probability threshold and selects tokens from most probable to least until the combined probability reaches this threshold. A lower value is suitable for factual answers while a higher one leads to more diverse output.';

export const ParameterButton = () => {
    const inferenceOpts = useAppContext((state) => state.inferenceOpts);
    const updateInferenceOpts = useAppContext((state) => state.updateInferenceOpts);
    const removeStopWord = useAppContext((state) => state.removeStopWord);
    const schema = useAppContext((state) => state.schema);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    if (!schema.data) {
        throw new Error('schema not loaded');
    }

    const [stopWordsInput, setStopWordsInput] = useState<string[]>([]);

    const opts = schema.data.Message.InferenceOpts;

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    useEffect(() => {
        if (inferenceOpts.stop) {
            setStopWordsInput(inferenceOpts.stop);
        }
    }, [inferenceOpts]);

    const handleOnChange = (_event: React.SyntheticEvent, value: string[]) => {
        // case when user press x at the corner of the auto complete.
        // this is to wipe value user typed.
        if (value.length === 0) {
            const stop: string[] = [];
            setStopWordsInput(stop);
            updateInferenceOpts({ stop });
            return;
        }
        const current = inferenceOpts.stop ?? [];
        const unique = new Set(current);
        const stop = unique.has(value[value.length - 1])
            ? current
            : [...current, value[value.length - 1]];
        setStopWordsInput(stop);
        updateInferenceOpts({ stop });
    };

    const ParameterHeader = (
        <>
            <Stack justifyContent="space-between" direction="row" gap={2}>
                <NavigationHeading>Parameter</NavigationHeading>
                <IconButton
                    onClick={handleDrawerClose}
                    sx={{ verticalAlign: 'middle', display: 'inline-flex' }}>
                    <CloseIcon />
                </IconButton>
            </Stack>
            <Divider />
        </>
    );

    return (
        <>
            <Button
                component="label"
                variant="contained"
                tabIndex={-1}
                startIcon={<SettingsIcon />}
                onClick={toggleDrawer}>
                Parameter
            </Button>
            <ResponsiveDrawer
                onClose={handleDrawerClose}
                open={isDrawerOpen}
                anchor="right"
                desktopDrawerVariant="persistent"
                mobileHeading={ParameterHeader}
                desktopHeading={ParameterHeader}
                desktopDrawerSx={{ gridArea: 'side-drawer' }}
                mobileDrawerSx={{ gridArea: 'side-drawer' }}>
                <Stack component="nav" direction="column" justifyContent="space-between" height="1">
                    <List>
                        <ListItem>
                            <InputLabel>Model</InputLabel>
                        </ListItem>
                        <ListItem>
                            <ModelSelect />
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
                                    value={stopWordsInput}
                                    freeSolo
                                    onChange={(event, value) => handleOnChange(event, value)}
                                    renderTags={(stopWords: readonly string[], getTagProps) =>
                                        stopWords.map((option: string, index: number) => (
                                            // getTagProps already included a key but eslint doesnt know about it.
                                            // eslint-disable-next-line react/jsx-key
                                            <Chip
                                                label={option}
                                                {...getTagProps({ index })}
                                                onDelete={() => {
                                                    removeStopWord(index);
                                                }}
                                            />
                                        ))
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Stop Words"
                                            placeholder="Enter Stop Word"
                                        />
                                    )}
                                />
                                <Typography variant="caption">
                                    Press &quot;Enter&quot; to add a new word.
                                </Typography>
                            </Box>
                        </ListItem>
                    </List>
                </Stack>
            </ResponsiveDrawer>
        </>
    );
};
