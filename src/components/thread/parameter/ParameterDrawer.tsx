import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, ListSubheader, Stack, Typography } from '@mui/material';
import React, { ReactElement, ReactNode } from 'react';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { USER_PERMISSIONS, useUserAuthInfo } from '@/api/auth/auth-loaders';
import { useAppContext } from '@/AppContext';
import { useColorMode } from '@/components/ColorModeProvider';
import { DesktopExpandingDrawer } from '@/components/DesktopExpandingDrawer';
import { FullScreenDrawer, FullScreenDrawerHeader } from '@/components/FullScreenDrawer';
import { ParameterSlider } from '@/components/thread/parameter/inputs/ParameterSlider';
import { StopWordsInput } from '@/components/thread/parameter/inputs/StopWordsInput';
import { useQueryContext } from '@/contexts/QueryContext';
import { DrawerId } from '@/slices/DrawerSlice';

import { ExtraParametersToggle } from './ExtraParametersInput';
import { ParameterToggle } from './inputs/ParameterToggle';
import { ToolCallingToggle } from './ToolCallingInput';

export const PARAMETERS_DRAWER_ID: DrawerId = 'parameters';

const TEMPERATURE_INFO =
    'Temperature controls the degree of randomness. Lower temperatures are suitable for prompts that expect accuracy and reliability, while higher temperatures lead to more diverse or creative results. The model will become repetitive as the temperature approaches zero.';

const TOP_P_INFO =
    'Top-p controls how the model selects tokens for output. It sets a probability threshold and selects tokens from most probable to least until the combined probability reaches this threshold. A lower value is suitable for factual answers while a higher one leads to more diverse output.';

const MAX_TOKENS_INFO =
    'Determines the maximum amount of text output from one prompt. Specifying this can help prevent long or irrelevant responses and control costs. One token is approximately 4 characters for standard English text.';

const BYPASS_SAFETY_CHECKS = 'Bypass our premodel safety checks for both prompt and image.';

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
        canCallTools,
        inferenceConstraints: constraints,
        inferenceOpts,
        updateInferenceOpts,
        bypassSafetyCheck,
        updateBypassSafetyCheck,
    } = useQueryContext();

    const userAuthInfo = useUserAuthInfo();

    return (
        <Stack>
            <ParametersList>
                <ParametersListItem>
                    <ParameterSlider
                        label="Temperature"
                        min={constraints?.temperature.minValue}
                        max={constraints?.temperature.maxValue}
                        step={constraints?.temperature.step}
                        initialValue={inferenceOpts.temperature ?? undefined}
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
                        min={constraints?.topP.minValue}
                        max={constraints?.topP.maxValue}
                        step={constraints?.topP.step}
                        initialValue={inferenceOpts.topP ?? undefined}
                        onChange={(v) => {
                            analyticsClient.trackParametersUpdate({
                                parameterUpdated: 'top_p',
                            });
                            updateInferenceOpts({ topP: v });
                        }}
                        dialogContent={TOP_P_INFO}
                        dialogTitle="Top P"
                        id="top-p"
                    />
                </ParametersListItem>
                <ParametersListItem>
                    <ParameterSlider
                        label="Max tokens"
                        min={constraints?.maxTokens.minValue}
                        max={constraints?.maxTokens.maxValue}
                        step={100}
                        initialValue={inferenceOpts.maxTokens ?? undefined}
                        onChange={(v) => {
                            analyticsClient.trackParametersUpdate({
                                parameterUpdated: 'max_tokens',
                            });
                            updateInferenceOpts({ maxTokens: v });
                        }}
                        dialogContent={MAX_TOKENS_INFO}
                        dialogTitle="Max Tokens"
                        id="max-tokens"
                    />
                </ParametersListItem>
                {canCallTools && (
                    <ParametersListItem>
                        <ToolCallingToggle />
                    </ParametersListItem>
                )}
                {userAuthInfo.hasPermission(USER_PERMISSIONS.WRITE_BYPASS_SAFETY_CHECKS) && (
                    <ParametersListItem>
                        <ParameterToggle
                            value={bypassSafetyCheck}
                            label="Bypass safety"
                            dialogContent={BYPASS_SAFETY_CHECKS}
                            hideEdit
                            dialogTitle="Bypass Safety"
                            id="bypass-safety-checks"
                            onToggleChange={(v) => {
                                updateBypassSafetyCheck(v);
                            }}
                        />
                    </ParametersListItem>
                )}
                <StopWordsInput
                    id="stop-words"
                    value={[...(inferenceOpts.stop ?? [])]} // spread to remove readonly
                    onChange={(_event, value) => {
                        analyticsClient.trackParametersUpdate({
                            parameterUpdated: 'stop',
                        });
                        updateInferenceOpts({ stop: value });
                    }}
                />
                {userAuthInfo.hasPermission(USER_PERMISSIONS.READ_INTERNAL_MODELS) && (
                    <ExtraParametersToggle />
                )}
            </ParametersList>
        </Stack>
    );
};
