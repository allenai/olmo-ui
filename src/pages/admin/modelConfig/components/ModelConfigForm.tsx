import { css } from '@allenai/varnish-panda-runtime/css';
import {
    Button,
    Link,
    Radio,
    SelectListBoxItem,
    SelectListBoxSection,
    Stack,
} from '@allenai/varnish-ui';
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
import { ExpandableTextArea } from '@/components/form/TextArea/ExpandableTextArea';
import { LinkButton } from '@/components/LinkButton';
import { links } from '@/Links';

import { FileSizeInput } from './FileSizeInput/FileSizeInput';
import { ModelHostSelect } from './ModelHostSelect';
import { ModelIdOnHostInput } from './ModelIdOnHostInput';

const inputSizing = css({ maxWidth: '[20rem]' });

const formSizing = css({ maxWidth: '[min(100%, 32rem)]' });

type MultiModalFormValues = Partial<
    Pick<
        SchemaCreateMultiModalModelConfigRequest,
        | 'acceptedFileTypes'
        | 'allowFilesInFollowups'
        | 'requireFileToPrompt'
        | 'maxFilesPerMessage'
        | 'maxTotalFileSize'
    >
>;

const mimeTypeRegex = /^[\w.-]+\/[\w+.-\\*]+$/;

const MultiModalFields = (): ReactNode => {
    const formContext = useFormContext<MultiModalFormValues>();

    return (
        <>
            <Controller
                name="acceptedFileTypes"
                control={formContext.control}
                rules={{
                    validate: (value) => {
                        const invalidValues =
                            value?.filter((item) => !mimeTypeRegex.test(item)) ?? [];

                        if (invalidValues.length === 0) {
                            return true;
                        }

                        return invalidValues.length === 1
                            ? `"${invalidValues[0]}" is not a valid file type.`
                            : `"${invalidValues.join(', ')}" are not valid file types`;
                    },
                }}
                render={({ field, fieldState }) => (
                    <Autocomplete
                        id={field.name}
                        multiple
                        freeSolo
                        fullWidth
                        options={['image/*', 'application/pdf']}
                        onChange={(_e, value) => {
                            field.onChange(value);
                        }}
                        renderInput={(params) => {
                            return (
                                <TextField
                                    {...params}
                                    label="Accepted file types"
                                    error={!!fieldState.error}
                                    helperText={
                                        fieldState.error?.message ?? (
                                            <>
                                                Must match the{' '}
                                                <Link href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types#structure_of_a_mime_type">
                                                    MIME type format
                                                </Link>
                                                .
                                            </>
                                        )
                                    }
                                />
                            );
                        }}
                    />
                )}
            />
            <Controller
                name="maxTotalFileSize"
                control={formContext.control}
                render={({ field }) => <FileSizeInput {...field} />}
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
        <ControlledDatePicker
            name="availableTime"
            label="Available time"
            granularity="minute"
            placeholderValue={now(userTimeZone)}
        />
    );
};

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
        | 'modelIdOnHost'
        | 'modelType'
        | 'name'
        | 'promptType'
        | 'canCallTools'
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

    const handleSubmit = (formData: ModelConfigFormValues) => {
        onSubmit(formData);
    };

    return (
        <form className={formSizing} onSubmit={formContext.handleSubmit(handleSubmit)}>
            <Stack fullWidth spacing={12} direction="column">
                <DevTool control={formContext.control} />
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
                <ExpandableTextArea
                    name="description"
                    label="Description"
                    controllerProps={{ rules: { required: true, minLength: 1 } }}
                />

                <ExpandableTextArea name="defaultSystemPrompt" label="Default System Prompt" />
                <ControlledSelect name="modelType" label="Model type">
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
                <ControlledDatePicker
                    name="deprecationTime"
                    label="Model expiration time"
                    granularity="minute"
                    placeholderValue={now(userTimeZone)}
                />
                <ControlledSwitch name="canCallTools" size="large">
                    This model can call tools
                </ControlledSwitch>
                <ControlledSwitch name="canThink" size="large">
                    This model can think
                </ControlledSwitch>
                <Stack direction="row" align="center" justify="center" spacing={3}>
                    <LinkButton to={links.modelConfiguration}>Cancel</LinkButton>
                    <Button variant="contained" type="submit">
                        Save
                    </Button>
                </Stack>
            </Stack>
        </form>
    );
};
