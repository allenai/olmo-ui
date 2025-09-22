import { css } from '@allenai/varnish-panda-runtime/css';
import { Button, Radio, SelectListBoxItem, SelectListBoxSection, Stack } from '@allenai/varnish-ui';
import { DevTool } from '@hookform/devtools';
import { now, type ZonedDateTime } from '@internationalized/date';
import { type ReactNode } from 'react';
import { DisclosureGroup } from 'react-aria-components';
import { useFormContext } from 'react-hook-form';

import { SchemaRootCreateModelConfigRequest } from '@/api/playgroundApi/playgroundApiSchema';
import { ControlledDatePicker } from '@/components/form/ControlledDatePicker';
import { ControlledInput } from '@/components/form/ControlledInput';
import { ControlledRadioGroup } from '@/components/form/ControlledRadioGroup';
import { ControlledSelect } from '@/components/form/ControlledSelect';
import { ControlledSliderWithInput } from '@/components/form/ControlledSliderWithInput';
import { ControlledSwitch } from '@/components/form/ControlledSwitch';
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

type BaseModelFormFieldValues = {
    availability: 'public' | 'internal' | 'prerelease';
    availableTime?: ZonedDateTime;
    deprecationTime?: ZonedDateTime;
} & Partial<
    Pick<
        SchemaRootCreateModelConfigRequest,
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
        | 'temperatureDefault'
        | 'temperatureLower'
        | 'temperatureUpper'
        | 'temperatureStep'
        | 'topPDefault'
        | 'topPLower'
        | 'topPUpper'
        | 'topPStep'
        | 'maxTokensDefault'
        | 'maxTokensLower'
        | 'maxTokensUpper'
        | 'maxTokensStep'
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

    const promptTypeState = formContext.watch('promptType');
    const showTimeSection = formContext.watch('availability') === 'prerelease';
    const modelInferenceOptions = {
        temperature: {
            minValue: formContext.getValues('temperatureLower') || undefined,
            maxValue: formContext.getValues('temperatureUpper') || undefined,
            step: formContext.getValues('temperatureStep') || undefined,
        },
        topP: {
            minValue: formContext.getValues('topPLower') || undefined,
            maxValue: formContext.getValues('topPUpper') || undefined,
            step: formContext.getValues('topPStep') || undefined,
        },
        maxTokens: {
            minValue: formContext.getValues('maxTokensLower') || undefined,
            maxValue: formContext.getValues('maxTokensUpper') || undefined,
            step: formContext.getValues('maxTokensStep') || undefined,
        },
    };

    const handleSubmit = (formData: ModelConfigFormValues) => {
        onSubmit(formData);
    };

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
                            name="temperatureDefault"
                            label="Temperature"
                            {...modelInferenceOptions.temperature}
                            controllerProps={{
                                rules: {
                                    required: true,
                                    min: modelInferenceOptions.temperature.minValue,
                                    max: modelInferenceOptions.temperature.maxValue,
                                },
                            }}
                        />
                        <ControlledSliderWithInput
                            name="topPDefault"
                            label="Top P"
                            {...modelInferenceOptions.topP}
                            controllerProps={{
                                rules: {
                                    required: true,
                                    min: modelInferenceOptions.topP.minValue,
                                    max: modelInferenceOptions.topP.maxValue,
                                },
                            }}
                        />
                        <ControlledSliderWithInput
                            name="maxTokensDefault"
                            label="Max tokens"
                            {...modelInferenceOptions.maxTokens}
                            controllerProps={{
                                rules: {
                                    required: true,
                                    min: modelInferenceOptions.maxTokens.minValue,
                                    max: modelInferenceOptions.maxTokens.maxValue,
                                },
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
