import { Stack } from '@mui/material';
import type { ReactElement } from 'react';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { ParameterSlider } from '@/components/thread/parameter/inputs/ParameterSlider';
import { ParametersList } from '@/components/thread/parameter/ParametersList';
import { ParametersListItem } from '@/components/thread/parameter/ParametersListtItem';
import { useQueryContext } from '@/contexts/QueryContext';

const MAX_TURNS_INFO =
    'Determines the maximum amount of turns the agent can make when generating a prompt.';

export const AgentParameterContent = (): ReactElement => {
    const {
        agentParameterConstraints: constraints,
        inferenceOpts,
        updateInferenceOpts,
    } = useQueryContext();

    return (
        <Stack>
            <ParametersList>
                <ParametersListItem>
                    <ParameterSlider
                        label="Max turns"
                        min={constraints?.maxTurns.minValue}
                        max={constraints?.maxTurns.maxValue}
                        step={constraints?.maxTurns.step}
                        initialValue={inferenceOpts.maxTurns ?? undefined}
                        onChange={(v) => {
                            analyticsClient.trackParametersUpdate({
                                parameterUpdated: 'max_turns',
                            });
                            updateInferenceOpts({ maxTurns: v });
                        }}
                        dialogContent={MAX_TURNS_INFO}
                        dialogTitle="Max turns"
                        id="max-turns"
                    />
                </ParametersListItem>
            </ParametersList>
        </Stack>
    );
};
