import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, ListSubheader, Stack, Typography } from '@mui/material';
import React, { ReactElement, ReactNode } from 'react';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { useAppContext } from '@/AppContext';
import { useColorMode } from '@/components/ColorModeProvider';
import { DesktopExpandingDrawer } from '@/components/DesktopExpandingDrawer';
import { FullScreenDrawer, FullScreenDrawerHeader } from '@/components/FullScreenDrawer';
import { ParameterSlider } from '@/components/thread/parameter/inputs/ParameterSlider';
import { StopWordsInput } from '@/components/thread/parameter/inputs/StopWordsInput';
import { useQueryContext } from '@/contexts/QueryContext';
import { DrawerId } from '@/slices/DrawerSlice';
import { SnackMessageType } from '@/slices/SnackMessageSlice';

import { FunctionDeclarationDialog } from '../tools/FunctionDeclarationDialog';
import { ParameterToggle } from './inputs/ParameterToggle';

export const PARAMETERS_DRAWER_ID: DrawerId = 'parameters';

const TEMPERATURE_INFO =
    'Temperature controls the degree of randomness. Lower temperatures are suitable for prompts that expect accuracy and reliability, while higher temperatures lead to more diverse or creative results. The model will become repetitive as the temperature approaches zero.';

const TOP_P_INFO =
    'Top-p controls how the model selects tokens for output. It sets a probability threshold and selects tokens from most probable to least until the combined probability reaches this threshold. A lower value is suitable for factual answers while a higher one leads to more diverse output.';

const MAX_TOKENS_INFO =
    'Determines the maximum amount of text output from one prompt. Specifying this can help prevent long or irrelevant responses and control costs. One token is approximately 4 characters for standard English text.';

export const DesktopParameterDrawer = (): ReactNode => {
    const open = useAppContext((state) => state.currentOpenDrawer === PARAMETERS_DRAWER_ID);
    const { colorMode } = useColorMode();

    return (
        <DesktopExpandingDrawer open={open} id="desktop-parameter-drawer">
            <Box
                sx={{
                    paddingBlockStart: 5,
                    paddingBlockEnd: 2,
                }}>
                <Typography
                    variant="body2"
                    component="h2"
                    color={colorMode === 'dark' ? 'primary.main' : undefined}>
                    Parameters
                </Typography>
                <ParameterContent />
            </Box>
        </DesktopExpandingDrawer>
    );
};

export const MobileParameterDrawer = (): ReactElement => {
    return (
        <FullScreenDrawer
            drawerId="parameters"
            fullWidth
            header={({ onDrawerClose }) => (
                <FullScreenDrawerHeader>
                    <Stack
                        justifyContent="space-between"
                        direction="row"
                        gap={2}
                        alignItems="center">
                        <ListSubheader sx={{ paddingBlock: 2, backgroundColor: 'transparent' }}>
                            <Typography
                                variant="h5"
                                margin={0}
                                color={(theme) => theme.palette.text.primary}>
                                Parameters
                            </Typography>
                        </ListSubheader>
                        <IconButton
                            onClick={onDrawerClose}
                            sx={{ color: 'inherit', opacity: 0.5 }}
                            aria-label="close parameters drawer">
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                </FullScreenDrawerHeader>
            )}>
            <ParameterContent />
        </FullScreenDrawer>
    );
};

const ParametersList = ({ children }: React.PropsWithChildren) => (
    <Box component="ul" margin="0" padding="0" display="grid" gridTemplateColumns="1fr auto">
        {children}
    </Box>
);
const ParametersListItem = ({ children }: React.PropsWithChildren) => (
    <Box component="li" display="grid" gridTemplateColumns="subgrid" gridColumn="1 / -1">
        {children}
    </Box>
);

export const ParameterContent = () => {
    const {
        threadStarted,
        canCallTools,
        inferenceOpts,
        updateInferenceOpts,
        userToolDefinitions,
        updateUserToolDefinitions,
        isToolCallingEnabled,
        updateIsToolCallingEnabled,
    } = useQueryContext();
    const canCreateToolDefinitions = canCallTools && !threadStarted;
    const [shouldShowFunctionDialog, setShouldShowFunctionDialog] = React.useState(false);

    const addSnackMessage = useAppContext((state) => state.addSnackMessage);
    const schemaData = useAppContext((state) => state.schema);
    if (schemaData == null) {
        return null;
    }

    const opts = schemaData.Message.InferenceOpts;
    const initialTemperature = inferenceOpts.temperature ?? opts.temperature.default ?? undefined;
    const initialTopP = inferenceOpts.top_p ?? opts.top_p.default ?? undefined;
    const maxTokens = inferenceOpts.max_tokens ?? opts.max_tokens.default ?? undefined;

    return (
        <Stack>
            <ParametersList>
                <ParametersListItem>
                    <ParameterSlider
                        label="Temperature"
                        min={opts.temperature.min}
                        max={opts.temperature.max}
                        step={opts.temperature.step}
                        initialValue={initialTemperature}
                        onChange={(v) => {
                            analyticsClient.trackParametersUpdate({
                                parameterUpdated: 'temperature',
                            });
                            updateInferenceOpts({ temperature: v });
                        }}
                        dialogContent={TEMPERATURE_INFO}
                        dialogTitle="Temperature"
                        id="temperature"
                    />
                </ParametersListItem>
                <ParametersListItem>
                    <ParameterSlider
                        label="Top P"
                        min={opts.top_p.min}
                        max={opts.top_p.max}
                        step={opts.top_p.step}
                        initialValue={initialTopP}
                        onChange={(v) => {
                            analyticsClient.trackParametersUpdate({
                                parameterUpdated: 'top_p',
                            });
                            updateInferenceOpts({ top_p: v });
                        }}
                        dialogContent={TOP_P_INFO}
                        dialogTitle="Top P"
                        id="top-p"
                    />
                </ParametersListItem>
                <ParametersListItem>
                    <ParameterSlider
                        label="Max tokens"
                        min={opts.max_tokens.min}
                        max={opts.max_tokens.max}
                        step={100}
                        initialValue={maxTokens}
                        onChange={(v) => {
                            analyticsClient.trackParametersUpdate({
                                parameterUpdated: 'max_tokens',
                            });
                            updateInferenceOpts({ max_tokens: v });
                        }}
                        dialogContent={MAX_TOKENS_INFO}
                        dialogTitle="Max Tokens"
                        id="max-tokens"
                    />
                </ParametersListItem>
                {canCallTools && (
                    <ParametersListItem>
                        <ParameterToggle
                            value={isToolCallingEnabled}
                            label="Function calling"
                            dialogContent="If enabled, function calling will be used."
                            dialogTitle="Function Calling"
                            disableToggle={!canCreateToolDefinitions}
                            disableEditButton={threadStarted ? false : !isToolCallingEnabled}
                            id="function-calling"
                            onEditClick={() => {
                                setShouldShowFunctionDialog(true);
                            }}
                            onToggleChange={(v) => {
                                updateIsToolCallingEnabled(v);
                            }}
                        />
                    </ParametersListItem>
                )}
                <StopWordsInput
                    id="stop-words"
                    value={inferenceOpts.stop || []}
                    onChange={(_event, value) => {
                        analyticsClient.trackParametersUpdate({
                            parameterUpdated: 'stop',
                        });
                        updateInferenceOpts({ stop: value });
                    }}
                />
                <FunctionDeclarationDialog
                    jsonData={userToolDefinitions || undefined}
                    isDisabled={threadStarted}
                    isOpen={shouldShowFunctionDialog}
                    onClose={() => {
                        setShouldShowFunctionDialog(false);
                    }}
                    onSave={({ declaration }) => {
                        analyticsClient.trackParametersUpdate({
                            parameterUpdated: 'tool_definitions',
                        });
                        updateUserToolDefinitions(declaration);
                        addSnackMessage({
                            id: `parameters-saved-${new Date().getTime()}`.toLowerCase(),
                            type: SnackMessageType.Brief,
                            message: 'Function Definition Saved',
                        });
                    }}
                />
            </ParametersList>
        </Stack>
    );
};
