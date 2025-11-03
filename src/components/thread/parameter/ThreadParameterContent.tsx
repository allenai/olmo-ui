import { Stack } from '@mui/material';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { USER_PERMISSIONS, useUserAuthInfo } from '@/api/auth/auth-loaders';
import { ParameterSlider } from '@/components/thread/parameter/inputs/ParameterSlider';
import { StopWordsInput } from '@/components/thread/parameter/inputs/StopWordsInput';
import { useQueryContext } from '@/contexts/QueryContext';

import { ExtraParametersToggle } from './ExtraParametersInput';
import { ParameterToggle } from './inputs/ParameterToggle';
import { ParametersList } from './ParametersList';
import { ParametersListItem } from './ParametersListtItem';
import { ToolCallingToggle } from './ToolCallingInput';

const TEMPERATURE_INFO =
    'Temperature controls the degree of randomness. Lower temperatures are suitable for prompts that expect accuracy and reliability, while higher temperatures lead to more diverse or creative results. The model will become repetitive as the temperature approaches zero.';

const TOP_P_INFO =
    'Top-p controls how the model selects tokens for output. It sets a probability threshold and selects tokens from most probable to least until the combined probability reaches this threshold. A lower value is suitable for factual answers while a higher one leads to more diverse output.';

const MAX_TOKENS_INFO =
    'Determines the maximum amount of text output from one prompt. Specifying this can help prevent long or irrelevant responses and control costs. One token is approximately 4 characters for standard English text.';

const BYPASS_SAFETY_CHECKS = 'Bypass our premodel safety checks for both prompt and image.';

export const ThreadParameterContent = () => {
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
                        step={constraints?.maxTokens.step}
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
