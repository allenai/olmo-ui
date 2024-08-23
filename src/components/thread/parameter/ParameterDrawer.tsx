import CloseIcon from '@mui/icons-material/Close';
import {
    AutocompleteChangeReason,
    Box,
    Divider,
    IconButton,
    List,
    ListItem,
    ListSubheader,
    Stack,
    Typography,
} from '@mui/material';
import { KeyboardEventHandler } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { Schema } from '@/api/Schema';
import { useAppContext } from '@/AppContext';
import { ResponsiveDrawer } from '@/components/ResponsiveDrawer';
import { ParameterSlider } from '@/components/thread/parameter/inputs/ParameterSlider';
import { DrawerId } from '@/slices/DrawerSlice';
import { SnackMessageType } from '@/slices/SnackMessageSlice';
import { useCloseDrawerOnNavigation } from '@/utils/useClosingDrawerOnNavigation-utils';

import { StopWordsInput } from './inputs/StopWordsInput';

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
    const isDrawerOpen = useAppContext((state) => state.currentOpenDrawer === PARAMETERS_DRAWER_ID);
    const addSnackMessage = useAppContext((state) => state.addSnackMessage);
    const addSnackMessageDebounce = useDebouncedCallback(() => {
        addSnackMessage({
            id: `parameters-saved-${new Date().getTime()}`.toLowerCase(),
            type: SnackMessageType.Brief,
            message: 'Parameters Saved',
        });
    }, 800);
    const handleDrawerClose = () => {
        closeDrawer(PARAMETERS_DRAWER_ID);
    };

    const opts = schemaData.Message.InferenceOpts;

    const handleOnChange = (
        _event: React.SyntheticEvent,
        value: string[],
        reason: AutocompleteChangeReason
    ) => {
        switch (reason) {
            default: {
                const uniqueStopWords = Array.from(
                    new Set(
                        value.map((val) => val.replace(/\\n/g, '\n').replace(/\\t/g, '\t'))
                    ).values()
                );

                updateInferenceOpts({ stop: uniqueStopWords });
                addSnackMessageDebounce();
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

    useCloseDrawerOnNavigation({
        handleDrawerClose,
    });

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
                        <IconButton
                            onClick={handleDrawerClose}
                            sx={{ color: 'inherit' }}
                            aria-label="close parameters drawer">
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                    <Divider />
                </Box>
            }
            desktopDrawerSx={{ gridArea: 'side-drawer' }}>
            <Stack direction="column">
                <List>
                    <ListItem>
                        <ParameterSlider
                            label="Temperature"
                            min={opts.temperature.min}
                            max={opts.temperature.max}
                            step={opts.temperature.step}
                            initialValue={opts.temperature.default}
                            onChange={(v) => {
                                updateInferenceOpts({ temperature: v });
                            }}
                            dialogContent={TEMPERATURE_INFO}
                            dialogTitle="Temperature"
                            id="temperature"
                        />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ParameterSlider
                            label="Top P"
                            min={opts.top_p.min}
                            max={opts.top_p.max}
                            step={opts.top_p.step}
                            initialValue={opts.top_p.default}
                            onChange={(v) => {
                                updateInferenceOpts({ top_p: v });
                            }}
                            dialogContent={TOP_P_INFO}
                            dialogTitle="Top P"
                            id="top-p"
                        />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <StopWordsInput
                            value={inferenceOpts.stop}
                            onChange={handleOnChange}
                            id="stop-words"
                        />
                    </ListItem>
                </List>
            </Stack>
        </ResponsiveDrawer>
    );
};
