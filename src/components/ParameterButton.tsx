import {
    Box,
    Button,
    Chip,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    Stack,
    Typography,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';
import { useState } from 'react';

import { ResponsiveDrawer } from './ResponsiveDrawer';
import { NavigationHeading } from './OlmoAppBar/NavigationHeading';
import { ModelSelect } from './NewQuery/ModelSelect';
import { InputSlider } from './configuration/InputSlider';
import { useAppContext } from '../AppContext';

const MAX_NEW_TOKEN_INFO =
    'Determines the maximum amount of text output from one prompt. Specifying this can help prevent long or irrelevant responses and control costs. One token is approximately 4 characters for standard English text.';

const TEMPERATURE_INFO =
    'Temperature controls the degree of randomness. Lower temperatures are suitable for prompts that expect accuracy and reliability, while higher temperatures lead to more diverse or creative results. The model will become repetitive as the temperature approaches zero.';

const TOP_P_INFO =
    'Top-p controls how the model selects tokens for output. It sets a probability threshold and selects tokens from most probable to least until the combined probability reaches this threshold. A lower value is suitable for factual answers while a higher one leads to more diverse output.';

export const ParameterButton = () => {
    const inferenceOpts = useAppContext((state) => state.inferenceOpts);
    const updateInferenceOpts = useAppContext((state) => state.updateInferenceOpts);
    const schema = useAppContext((state) => state.schema);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    if (!schema.data) {
        throw new Error('schema not loaded');
    }

    const formContext = useForm({
        defaultValues: {
            stopWordInput: '',
        },
    });

    const watchStopWordInput = formContext.watch('stopWordInput');

    const opts = schema.data.Message.InferenceOpts;

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const handleClearAll = () => {
        const stop: string[] = [];
        updateInferenceOpts({ stop });
    };

    const handleUserKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Tab') {
            formContext.handleSubmit(handleStopWordSubmit)();
        }
    };

    const handleStopWordSubmit = () => {
        const current = inferenceOpts.stop ?? [];
        const unique = new Set(current);
        const stop = unique.has(watchStopWordInput) ? current : [...current, watchStopWordInput];
        updateInferenceOpts({ stop });
        formContext.setValue('stopWordInput', '');
    };
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
                desktopHeading={
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
                }
                desktopDrawerSx={{ gridArea: 'side-drawer' }}>
                <Stack component="nav" direction="column" justifyContent="space-between" height="1">
                    <List>
                        <NavigationHeading>Model</NavigationHeading>
                        <ListItem>
                            <ModelSelect />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem>
                            <InputSlider
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
                            <InputSlider
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
                            <InputSlider
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
                    </List>
                    <Divider />
                    <List>
                        <ListItem>
                            <Box sx={{ width: '100%' }}>
                                <FormContainer
                                    formContext={formContext}
                                    FormProps={{
                                        style: { height: '100%' },
                                        'aria-label': 'Stop Word Prompt',
                                    }}>
                                    <TextFieldElement
                                        size="small"
                                        placeholder="Enter Stop Word"
                                        onKeyDown={handleUserKeyPress}
                                        maxRows={13}
                                        name="stopWordInput"
                                    />
                                </FormContainer>
                                <Typography variant="caption">
                                    Hit &quot;Tab&quot; to add a new word.
                                </Typography>
                                <Grid container spacing={1} paddingY={1}>
                                    {inferenceOpts.stop?.map((word, i) => (
                                        <Grid item key={`stop-${i}-${word}`}>
                                            <Chip
                                                label={word}
                                                title={word}
                                                onDelete={() => {
                                                    const current = inferenceOpts.stop ?? [];
                                                    const stop = current
                                                        .slice(0, i)
                                                        .concat(current.slice(i + 1));
                                                    updateInferenceOpts({ stop });
                                                }}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                                <Button variant="outlined" onClick={handleClearAll}>
                                    Clear All
                                </Button>
                            </Box>
                        </ListItem>
                    </List>
                </Stack>
            </ResponsiveDrawer>
        </>
    );
};
