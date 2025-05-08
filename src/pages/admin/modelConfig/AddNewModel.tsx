import {
    Button,
    Radio,
    Select,
    SelectListBoxItem,
    SelectListBoxSection,
    Stack,
} from '@allenai/varnish-ui';
import { DevTool } from '@hookform/devtools';
import { Autocomplete, Box, TextField } from '@mui/material';
import React, { type ReactNode } from 'react';
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form';
import {
    RadioButtonGroup,
    SelectElement,
    SwitchElement,
    TextFieldElement,
} from 'react-hook-form-mui';
import { useSubmit } from 'react-router-dom';

import { SchemaRootCreateModelConfigRequest } from '@/api/playgroundApi/playgroundApiSchema';
import { ControlledInput } from '@/components/ControlledInput';
import { DatePicker } from '@/components/datepicker/DatePicker';
import { ControlledRadioGroup } from '@/components/form/ControlledRadioGroup';
import { ControlledSelect } from '@/components/form/ControlledSelect';
import { MetaTags } from '@/components/MetaTags';

const MultiModalFields = (): ReactNode => {
    const formContext = useFormContext<SchemaRootCreateModelConfigRequest>();
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
                        options={['.jpg', '.png', '*']}
                        renderInput={(params) => {
                            return <TextField {...params} label="Accepted file types" />;
                        }}
                    />
                )}
            />
            <SelectElement
                name="requireFileToPrompt"
                label="File prompt requirement"
                options={[
                    { id: 'first_message', label: 'First message' },
                    { id: 'all_messages', label: 'All messages' },
                    { id: 'no_requirement', label: 'No requirement' },
                ]}
            />
            <Box flexDirection="row" display="flex" gap={10}>
                <SwitchElement
                    name="allowFilesInFollowups"
                    label="Allow files in followup prompts"
                    control={formContext.control}
                    sx={{ flex: 1 }}
                />
                <TextFieldElement
                    name="maxFilesPerMessage"
                    control={formContext.control}
                    label="Max files per message"
                    type="number"
                    variant="standard"
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true, sx: { fontSize: '18px' } }}
                    sx={{ flex: 1 }}
                />
            </Box>
        </>
    );
};

const TimeFields = (): ReactNode => {
    const formContext = useFormContext<SchemaRootCreateModelConfigRequest>();
    return (
        <Box flexDirection="row" display="flex" gap={10}>
            <Controller
                name="availableTime"
                control={formContext.control}
                render={() => (
                    <DatePicker
                        labelText="Available time"
                        granularity="second"
                        onChange={(value) => {
                            formContext.setValue('availableTime', value?.toString());
                        }}
                    />
                )}
            />
            <Controller
                name="deprecationTime"
                control={formContext.control}
                render={() => (
                    <DatePicker
                        labelText="Deprecation time"
                        granularity="second"
                        onChange={(value) => {
                            formContext.setValue('availableTime', value?.toString());
                        }}
                    />
                )}
            />
        </Box>
    );
};

const availability = ['Public', 'Internal', 'Pre-release'];

export const AddNewModel = () => {
    const formContext = useForm<SchemaRootCreateModelConfigRequest>({
        defaultValues: {
            promptType: 'text_only',
        },
        mode: 'onChange',
    });

    const submit = useSubmit();
    const [promptTypeState, setPromptTypeState] = React.useState<string>();
    const [showTimeSection, setShowTimeSection] = React.useState<boolean>(false);
    const handleSubmit = (formData: SchemaRootCreateModelConfigRequest) => {
        submit(formData, { method: 'post' });
    };

    return (
        <>
            <MetaTags />
            <FormProvider {...formContext}>
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
                                label="ID (The ID you see when linking to this model)"
                                fullWidth
                                controllerProps={{ rules: { required: true } }}
                            />

                            <ControlledSelect
                                name="modelFamily"
                                label="Model family"
                                controllerProps={{ rules: { required: true } }}>
                                <SelectListBoxSection>
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
                                </SelectListBoxSection>
                            </ControlledSelect>
                            <ControlledInput
                                name="modelIdOnHost"
                                label="Model host ID"
                                description="The ID on this model on the host"
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
                                controllerProps={{ rules: { required: true } }}
                            />

                            <ControlledRadioGroup name="promptType" label="Prompt type">
                                <Radio value="text_only">Text only</Radio>
                                <Radio value="multimodal">Multimodal</Radio>
                            </ControlledRadioGroup>
                            {promptTypeState === 'multimodal' && <MultiModalFields />}
                            <ControlledSelect name="availability" label="Availability">
                                <SelectListBoxSection>
                                    <SelectListBoxItem
                                        text="Public"
                                        value={{ id: 'public', label: 'Public' }}
                                    />
                                    <SelectListBoxItem
                                        text="Internal"
                                        value={{ id: 'internal', label: 'Internal' }}
                                    />
                                    <SelectListBoxItem
                                        text="Pre-release"
                                        value={{ id: 'prerelease', label: 'Pre-release' }}
                                    />
                                </SelectListBoxSection>
                            </ControlledSelect>
                            {showTimeSection && <TimeFields />}
                            <Stack direction="row" align="center" justify="center" spacing={3}>
                                <Button variant="outlined">Cancel</Button>
                                <Button variant="contained" type="submit">
                                    Save
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                </Stack>
            </FormProvider>
        </>
    );
};
