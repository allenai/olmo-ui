import { css } from '@allenai/varnish-panda-runtime/css';
import { Button, Radio, SelectListBoxItem, SelectListBoxSection, Stack } from '@allenai/varnish-ui';
import { DevTool } from '@hookform/devtools';
import { now, type ZonedDateTime } from '@internationalized/date';
import { type ReactNode, useEffect, useState } from 'react';
import { DisclosureGroup } from 'react-aria-components';
import { useFormContext } from 'react-hook-form';

import { SchemaResponseModel } from '@/api/playgroundApi/playgroundApiSchema';
import { ControlledDatePicker } from '@/components/form/ControlledDatePicker';
import { ControlledInput } from '@/components/form/ControlledInput';
import { ControlledRadioGroup } from '@/components/form/ControlledRadioGroup';
import { ControlledSelect } from '@/components/form/ControlledSelect';
import { ControlledSliderWithInput } from '@/components/form/ControlledSliderWithInput';
import { ControlledSwitch } from '@/components/form/ControlledSwitch';
import { SliderWithInput } from '@/components/form/SliderWithInput';
import { ExpandableTextArea } from '@/components/form/TextArea/ExpandableTextArea';
import { LinkButton } from '@/components/LinkButton';
import { CollapsibleWidget } from '@/components/widgets/CollapsibleWidget/CollapsibleWidget';
import { links } from '@/Links';

import { Fieldset } from './Fieldset';
import { InfiniGramIndexInput } from './inputs/InfiniGramIndexInput';
import { ModelHostSelect } from './inputs/ModelHostSelect';
import { ModelIdOnHostInput } from './inputs/ModelIdOnHostInput';
import { MultiModalFields, MultiModalFormValues } from './MultiModalFields';

const urlRegex = /^(https?:\/\/)([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/;

type MinMaxDefault = {
    default: number;
    minValue: number;
    maxValue: number;
    step: number;
};
type InferenceConstrints = {
    temperature: MinMaxDefault;
    topP: MinMaxDefault;
    maxTokens: MinMaxDefault;
    stop?: readonly string[];
};

type BaseModelFormFieldValues = {
    availability: 'public' | 'internal' | 'prerelease';
    availableTime?: ZonedDateTime;
    deprecationTime?: ZonedDateTime;
    inferenceConstraints: InferenceConstrints;
} & Partial<
    Pick<
        SchemaResponseModel,
        | 'defaultSystemPrompt'
        | 'description'
        | 'familyId'
        | 'host'
        | 'id'
        | 'informationUrl'
        | 'modelIdOnHost'
        | 'modelType'
        | 'name'
        | 'promptType'
        | 'canCallTools'
        | 'canThink'
        | 'infiniGramIndex'
    >
>;

export type ModelConfigFormValues = BaseModelFormFieldValues & MultiModalFormValues;

interface ModelConfigFormProps {
    onSubmit: (formData: ModelConfigFormValues) => void;
    disableIdField?: boolean;
}

export const ModelConfigForm = ({ onSubmit, disableIdField = false }: ModelConfigFormProps) => {
    const formContext = useFormContext<ModelConfigFormValues>();
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const inferenceConstraints = formContext.getValues('inferenceConstraints');
    const [maxTokenBase2Limit, setMaxTokenBase2Limit] = useState(
        Math.log2(inferenceConstraints.maxTokens.maxValue)
    );

    const promptTypeState = formContext.watch('promptType');
    const showTimeSection = formContext.watch('availability') === 'prerelease';
    const maxTokensMaxValue = formContext.watch('inferenceConstraints.maxTokens.maxValue');

    const handleSubmit = (formData: ModelConfigFormValues) => {
        onSubmit(formData);
    };

    useEffect(() => {
        const currentInferenceConstraints = formContext.getValues('inferenceConstraints');
        if (
            maxTokensMaxValue &&
            currentInferenceConstraints.maxTokens.default > maxTokensMaxValue
        ) {
            formContext.setValue('inferenceConstraints.maxTokens.default', maxTokensMaxValue);
        }
    }, [formContext, maxTokensMaxValue]);

    return (
        <form
            className={css({ maxWidth: '[min(100%, 32rem)]', marginBottom: '8' })}
            onSubmit={formContext.handleSubmit(handleSubmit)}>
            <DisclosureGroup
                className={css({ '& > *': { marginBottom: '4' } })}
                defaultExpandedKeys={['basic', 'hosting']}
                allowsMultipleExpanded>
                <CollapsibleWidget id="basic" heading="Basic">
                    <Fieldset>
                        <ControlledInput
                            name="name"
                            label="Name"
                            fullWidth
                            className={inputSizing}
                            controllerProps={{ rules: { required: true, minLength: 1 } }}
                        />
                        <ControlledInput
                            name="id"
                            label="ID"
                            description="The ID you see when linking to this model"
                            className={inputSizing}
                            fullWidth
                            controllerProps={{ rules: { required: true, minLength: 1 } }}
                            isDisabled={disableIdField}
                        />

                        <ControlledSelect
                            name="familyId"
                            label="Model family"
                            controllerProps={{ rules: { required: true } }}>
                            <SelectListBoxSection>
                                <SelectListBoxItem text="No family" id="no_family" />
                                <SelectListBoxItem text="OLMo" id="olmo" />
                                <SelectListBoxItem text="Tülu" id="tulu" />
                            </SelectListBoxSection>
                        </ControlledSelect>

                        <ExpandableTextArea
                            name="description"
                            label="Description"
                            controllerProps={{ rules: { required: true, minLength: 1 } }}
                        />

                        <ControlledInput
                            name="informationUrl"
                            label="Information URL"
                            description="The link to information about this model."
                            className={inputSizing}
                            fullWidth
                            controllerProps={{
                                rules: {
                                    required: false,
                                    pattern: {
                                        value: urlRegex,
                                        message: 'Please enter a valid URL.',
                                    },
                                },
                            }}
                        />

                        <ControlledSelect name="modelType" label="Model type">
                            <SelectListBoxItem text="Chat" id="chat" />
                            <SelectListBoxItem text="Base" id="base" />
                        </ControlledSelect>

                        <InfiniGramIndexInput name="infiniGramIndex" label="Infini-gram index" />

                        <ControlledRadioGroup name="promptType" label="Prompt type">
                            <Radio value="text_only">Text only</Radio>
                            <Radio value="multi_modal">Multimodal</Radio>
                        </ControlledRadioGroup>
                    </Fieldset>
                </CollapsibleWidget>

                <CollapsibleWidget id="hosting" heading="Hosting">
                    <Fieldset>
                        <ModelHostSelect
                            name="host"
                            label="Model host"
                            controllerProps={{ rules: { required: true } }}
                        />

                        <ModelIdOnHostInput
                            name="modelIdOnHost"
                            hostKey="host"
                            className={inputSizing}
                            fullWidth
                            controllerProps={{ rules: { required: true } }}
                        />
                    </Fieldset>
                </CollapsibleWidget>

                {promptTypeState === 'multi_modal' && (
                    <CollapsibleWidget id="multimodal" heading="Multimodal">
                        <Fieldset>
                            <MultiModalFields />
                        </Fieldset>
                    </CollapsibleWidget>
                )}

                <CollapsibleWidget id="advanced" heading="Advanced">
                    <Fieldset>
                        <ExpandableTextArea
                            name="defaultSystemPrompt"
                            label="Default System Prompt"
                        />
                        <ControlledSwitch name="canCallTools" size="large">
                            This model can call tools
                        </ControlledSwitch>
                        <ControlledSwitch name="canThink" size="large">
                            This model can think
                        </ControlledSwitch>

                        <ControlledSliderWithInput
                            name="inferenceConstraints.temperature.default"
                            label="Default Temperature"
                            {...inferenceConstraints.temperature}
                            controllerProps={{
                                rules: {
                                    required: true,
                                    min: inferenceConstraints.temperature.minValue,
                                    max: inferenceConstraints.temperature.maxValue,
                                },
                            }}
                        />
                        <ControlledSliderWithInput
                            name="inferenceConstraints.topP.default"
                            label="Default Top P"
                            {...inferenceConstraints.topP}
                            controllerProps={{
                                rules: {
                                    required: true,
                                    min: inferenceConstraints.topP.minValue,
                                    max: inferenceConstraints.topP.maxValue,
                                },
                            }}
                        />
                        <ControlledSliderWithInput
                            name="inferenceConstraints.maxTokens.default"
                            label="Default Max Tokens"
                            {...inferenceConstraints.maxTokens}
                            controllerProps={{
                                rules: {
                                    required: true,
                                    min: inferenceConstraints.maxTokens.minValue,
                                    max: inferenceConstraints.maxTokens.maxValue,
                                },
                            }}
                        />

                        <SliderWithInput
                            name="maxTokensMaxValue"
                            label="Upper Limit of Max Tokens (Base 2 Exponent)"
                            minValue={10} // 2^10 = 1,024
                            maxValue={20} // 2^20 = 1,048,576
                            step={1}
                            value={maxTokenBase2Limit}
                            onChange={(value) => {
                                const maxAllowed = Math.floor(Math.log2(Number.MAX_SAFE_INTEGER));
                                // NOTE: don't go over Number.MAX_SAFE_INTEGER, if we bump maxValue too high
                                if (value > maxAllowed) {
                                    value = maxAllowed;
                                }
                                setMaxTokenBase2Limit(value);
                                const newMaxTokenLimit = Math.pow(2, value);

                                formContext.setValue(
                                    'inferenceConstraints.maxTokens.maxValue',
                                    newMaxTokenLimit
                                );
                            }}
                        />
                    </Fieldset>
                </CollapsibleWidget>

                <CollapsibleWidget id="availability" heading="Availability">
                    <Fieldset legend="Availability Configuration for Model">
                        <ControlledSelect name="availability" label="Availability">
                            <SelectListBoxSection>
                                <SelectListBoxItem text="Public" id="public" />
                                <SelectListBoxItem text="Internal" id="internal" />
                                <SelectListBoxItem text="Pre-release" id="prerelease" />
                            </SelectListBoxSection>
                        </ControlledSelect>
                        {showTimeSection && <TimeFields />}
                        <ControlledDatePicker
                            name="deprecationTime"
                            label="Model expiration time"
                            granularity="minute"
                            placeholderValue={now(userTimeZone)}
                        />
                    </Fieldset>
                </CollapsibleWidget>
            </DisclosureGroup>
            <Stack direction="row" align="center" justify="end" spacing={3}>
                <LinkButton to={links.modelConfiguration}>Cancel</LinkButton>
                <Button variant="contained" type="submit">
                    Save
                </Button>
            </Stack>
            {process.env.NODE_ENV === 'development' && <DevTool control={formContext.control} />}
        </form>
    );
};

const TimeFields = (): ReactNode => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return (
        <ControlledDatePicker
            name="availableTime"
            label="Available time"
            granularity="minute"
            placeholderValue={now(userTimeZone)}
        />
    );
};

const inputSizing = css({ maxWidth: '[20rem]' });
