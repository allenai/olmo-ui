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
    SchemaModelHost,
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

const inputSizing = css({ maxWidth: '[20rem]' });

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
    >
>;

const hostIdFieldMeta: Record<SchemaModelHost, { label: string; description: React.ReactNode }> = {
    modal: {
        label: 'App ID',
        description: (
            <Link
                href="https://github.com/allenai/reviz-modal/blob/main/docs/self-serve-hosting.md"
                target="_blank"
                rel="noopener">
                View Modal hosting docs
            </Link>
        ),
    },
    inferd: {
        label: 'Compute Source ID',
        description: undefined,
    },
    beaker_queues: {
        label: 'Queue ID',
        description: undefined,
    },
    cirrascale_backend: {
        label: 'Backend API Port',
        description: (
            <span>
                The port this model runs on. E.g.{' '}
                <code>https://ai2models.cirrascalecloud.services:{'<PORT>'}/v1/models</code>
            </span>
        ),
    },
};

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

    const modelHostSelection = formContext.watch('host');
    const hostMeta = modelHostSelection ? hostIdFieldMeta[modelHostSelection] : null;

    const modelHostIdLabel =
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        modelHostSelection && hostMeta?.label
            ? hostIdFieldMeta[modelHostSelection].label
            : 'Model Host Id';

    const modelHostIdDescription =
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        modelHostSelection && hostMeta?.description
            ? hostIdFieldMeta[modelHostSelection].description
            : 'The ID of this model on the host';

    return (
        <form onSubmit={formContext.handleSubmit(handleSubmit)}>
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
                <ControlledSelect
                    name="host"
                    label="Model host"
                    controllerProps={{ rules: { required: true } }}>
                    <SelectListBoxSection>
                        <SelectListBoxItem text="Modal" id="modal" />
                        <SelectListBoxItem text="InferD" id="inferd" />
                        <SelectListBoxItem text="Beaker Queues" id="beaker_queues" />
                        <SelectListBoxItem text="Cirrascale (Backend)" id="cirrascale_backend" />
                    </SelectListBoxSection>
                </ControlledSelect>

                <ControlledInput
                    name="modelIdOnHost"
                    label={modelHostIdLabel}
                    fullWidth
                    // @ts-expect-error: description can be a ReactNode, not just string
                    description={modelHostIdDescription}
                    className={inputSizing}
                    controllerProps={{ rules: { required: true } }}
                />
                <ExpandableTextArea
                    name="description"
                    label="Description"
                    fullWidth
                    controllerProps={{ rules: { required: true, minLength: 1 } }}
                />

                <ExpandableTextArea
                    name="defaultSystemPrompt"
                    label="Default System Prompt"
                    fullWidth
                />
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
