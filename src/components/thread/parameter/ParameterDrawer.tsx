import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListSubheader,
    Stack,
    Typography,
} from '@mui/material';
import { KeyboardEventHandler } from 'react';

import { useAppContext } from '@/AppContext';
import { ParameterSlider } from '@/components/thread/parameter/inputs/ParameterSlider';
import { DrawerId } from '@/slices/DrawerSlice';
import { useCloseDrawerOnNavigation } from '@/utils/useClosingDrawerOnNavigation-utils';

export const PARAMETERS_DRAWER_ID: DrawerId = 'parameters';

const TEMPERATURE_INFO =
    'Temperature controls the degree of randomness. Lower temperatures are suitable for prompts that expect accuracy and reliability, while higher temperatures lead to more diverse or creative results. The model will become repetitive as the temperature approaches zero.';

const TOP_P_INFO =
    'Top-p controls how the model selects tokens for output. It sets a probability threshold and selects tokens from most probable to least until the combined probability reaches this threshold. A lower value is suitable for factual answers while a higher one leads to more diverse output.';

const MAX_NEW_TOKENS_INFO =
    'Determines the maximum amount of text output from one prompt. Specifying this can help prevent long or irrelevant responses and control costs. One token is approximately 4 characters for standard English text.';
export const ParameterDrawer = (): JSX.Element => {
    const isDrawerOpen = useAppContext((state) => state.currentOpenDrawer === PARAMETERS_DRAWER_ID);
    const closeDrawer = useAppContext((state) => state.closeDrawer);

    const handleDrawerClose = () => {
        closeDrawer(PARAMETERS_DRAWER_ID);
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
        <Drawer
            variant="temporary"
            onClose={handleDrawerClose}
            onKeyDown={onKeyDownEscapeHandler}
            open={isDrawerOpen}
            anchor="right"
            PaperProps={{
                sx: { width: 1, backgroundColor: (theme) => theme.palette.background.default },
            }}>
            <Box
                sx={{
                    position: 'sticky',
                    top: 0,
                    background: 'inherit',
                    zIndex: 1,
                }}>
                <Stack justifyContent="space-between" direction="row" gap={2} alignItems="center">
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
            <ParameterContent />
        </Drawer>
    );
};

export const ParameterContent = () => {
    const updateInferenceOpts = useAppContext((state) => state.updateInferenceOpts);

    const schemaData = useAppContext((state) => state.schema);

    if (schemaData == null) {
        return null;
    }

    const opts = schemaData.Message.InferenceOpts;

    return (
        <Stack direction="column">
            <List>
                <ListItem>
                    <ParameterSlider
                        label="Max new tokens"
                        min={opts.max_tokens.min}
                        max={opts.max_tokens.max}
                        step={opts.max_tokens.step}
                        initialValue={opts.max_tokens.default}
                        onChange={(v) => {
                            updateInferenceOpts({ max_tokens: v });
                        }}
                        dialogContent={MAX_NEW_TOKENS_INFO}
                        dialogTitle="Max new tokens"
                        id="tokens"
                    />
                </ListItem>
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
            </List>
        </Stack>
    );
};
