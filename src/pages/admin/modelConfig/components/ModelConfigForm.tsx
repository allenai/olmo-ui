import { Button, Radio, SelectListBoxItem, SelectListBoxSection, Stack } from '@allenai/varnish-ui';
import { DevTool } from '@hookform/devtools';
import { now, type ZonedDateTime } from '@internationalized/date';
import { Autocomplete, TextField } from '@mui/material';
import { type ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import {
    type SchemaCreateMultiModalModelConfigRequest,
    SchemaRootCreateModelConfigRequest,
} from '@/api/playgroundApi/playgroundApiSchema';
import { ControlledDatePicker } from '@/components/form/ControlledDatePicker';
import { ControlledInput } from '@/components/form/ControlledInput';
import { ControlledRadioGroup } from '@/components/form/ControlledRadioGroup';
import { ControlledSelect } from '@/components/form/ControlledSelect';
import { ControlledSwitch } from '@/components/form/ControlledSwitch';
import { LinkButton } from '@/components/LinkButton';
import { links } from '@/Links';

type MultiModalFormValues = Pick<
    SchemaCreateMultiModalModelConfigRequest,
    'acceptedFileTypes' | 'allowFilesInFollowups' | 'requireFileToPrompt' | 'maxFilesPerMessage'
>;

const MultiModalFields = (): ReactNode => {
    const formContext = useFormContext<MultiModalFormValues>();
    return (
        <>
            <Controller
                name="acceptedFileTypes"
                control={formContext.control}
                render={({ field }) => (
                    <Autocomplete
                        id={field.name}
                        multiple
                        freeSolo
                        fullWidth
                        options={[]}
                        onChange={(_e, value) => {
                            field.onChange(value);
                        }}
                        renderInput={(params) => {
                            return <TextField {...params} label="Accepted file types" />;
                        }}
                    />
                )}
            />
            <ControlledSelect
                name="requireFileToPrompt"
                label="File prompt requirement"
                controllerProps={{ rules: { required: true } }}>
                <SelectListBoxItem
                    id="first_message"
                    text="First message"
                    textValue="First message"
                />
                <SelectListBoxItem id="all_messages" text="All messages" textValue="All messages" />
                <SelectListBoxItem
                    id="no_requirement"
                    text="No requirement"
                    textValue="No requirement"
                />
            </ControlledSelect>
            <Stack direction="column" spacing={10}>
                <ControlledSwitch name="allowFilesInFollowups">
                    Allow files in followup prompts
                </ControlledSwitch>
                <ControlledInput
                    name="maxFilesPerMessage"
                    label="Max files per message"
                    type="number"
                />
            </Stack>
        </>
    );
};

const TimeFields = (): ReactNode => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return (
        <Stack direction="row" spacing={10}>
            <ControlledDatePicker
                name="availableTime"
                label="Available time"
                granularity="minute"
                placeholderValue={now(userTimeZone)}
            />
            <ControlledDatePicker
                name="deprecationTime"
                label="Deprecation time"
                granularity="minute"
                placeholderValue={now(userTimeZone)}
            />
        </Stack>
    );
};

type BaseModelFormFieldValues = {
    availability: 'public' | 'internal' | 'prerelease';
    availableTime?: ZonedDateTime;
    deprecationTime?: ZonedDateTime;
} & Pick<
    SchemaRootCreateModelConfigRequest,
    | 'defaultSystemPrompt'
    | 'description'
    | 'familyId'
    | 'host'
    | 'id'
    | 'modelIdOnHost'
    | 'modelType'
    | 'name'
    | 'promptType'
>;

export type ModelConfigFormValues = BaseModelFormFieldValues & Partial<MultiModalFormValues>;

interface ModelConfigFormProps {
    onSubmit: (formData: ModelConfigFormValues) => void;
}

export const ModelConfigForm = ({ onSubmit }: ModelConfigFormProps) => {
    const formContext = useFormContext<ModelConfigFormValues>();

    const promptTypeState = formContext.watch('promptType');
    const showTimeSection = formContext.watch('availability') === 'prerelease';

    const handleSubmit = (formData: ModelConfigFormValues) => {
        onSubmit(formData);
    };

    return (
        <Stack spacing={8} direction="row" wrap="wrap">
            <form onSubmit={formContext.handleSubmit(handleSubmit)}>
                <Stack spacing={8} direction="column">
                    <DevTool control={formContext.control} />
                    <ControlledInput
                        name="name"
                        label="Name"
                        fullWidth
                        controllerProps={{ rules: { required: true } }}
                    />
                    <ControlledInput
                        name="id"
                        label="ID"
                        description="The ID you see when linking to this model"
                        fullWidth
                        controllerProps={{ rules: { required: true } }}
                    />

                    <Stack direction="row" spacing={16} align="center">
                        <ControlledSelect
                            name="familyId"
                            label="Model family"
                            controllerProps={{ rules: { required: true } }}>
                            <SelectListBoxSection>
                                <SelectListBoxItem text="OLMo" id="olmo" />
                                <SelectListBoxItem text="Tülu" id="tulu" />
                            </SelectListBoxSection>
                        </ControlledSelect>
                        <Button
                            variant="contained"
                            onPress={() => {
                                formContext.setValue('familyId', null);
                            }}>
                            Clear
                        </Button>
                    </Stack>
                    <ControlledSelect
                        name="host"
                        label="Model host"
                        controllerProps={{ rules: { required: true } }}>
                        <SelectListBoxSection>
                            <SelectListBoxItem text="Modal" id="modal" />
                            <SelectListBoxItem text="InferD" id="inferd" />
                        </SelectListBoxSection>
                    </ControlledSelect>
                    <ControlledInput
                        name="modelIdOnHost"
                        label="Model host ID"
                        description="The ID of this model on the host"
                        fullWidth
                        controllerProps={{ rules: { required: true } }}
                    />
                    <ControlledInput
                        name="description"
                        label="Description"
                        fullWidth
                        controllerProps={{ rules: { required: true } }}
                    />

                    <ControlledInput
                        name="defaultSystemPrompt"
                        label="Default System Prompt"
                        fullWidth
                    />
                    <ControlledSelect name="modelType" label="Model type" fullWidth>
                        <SelectListBoxItem text="Chat" id="chat" />
                        <SelectListBoxItem text="Base" id="base" />
                    </ControlledSelect>
                    <ControlledRadioGroup name="promptType" label="Prompt type">
                        <Radio value="text_only">Text only</Radio>
                        <Radio value="multi_modal">Multimodal</Radio>
                    </ControlledRadioGroup>
                    {promptTypeState === 'multi_modal' && <MultiModalFields />}
                    <ControlledSelect name="availability" label="Availability">
                        <SelectListBoxSection>
                            <SelectListBoxItem text="Public" id="public" />
                            <SelectListBoxItem text="Internal" id="internal" />
                            <SelectListBoxItem text="Pre-release" id="prerelease" />
                        </SelectListBoxSection>
                    </ControlledSelect>
                    {showTimeSection && <TimeFields />}
                    <Stack direction="row" align="center" justify="center" spacing={3}>
                        <LinkButton to={links.modelConfiguration}>Cancel</LinkButton>
                        <Button variant="contained" type="submit">
                            Save
                        </Button>
                    </Stack>
                </Stack>
            </form>
        </Stack>
    );
};
