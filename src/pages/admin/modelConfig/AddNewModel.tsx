import { Button, Select, Stack } from '@allenai/varnish-ui';
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

                            <Autocomplete
                                options={['Olmo', 'Tulu']}
                                renderInput={(params) => {
                                    return <TextField {...params} label="Model family" />;
                                }}
                                sx={{ width: '300px' }}
                                freeSolo
                            />
                            <SelectElement
                                name="host"
                                label="Model host"
                                control={formContext.control}
                                options={[
                                    { id: 'modal', label: 'Modal' },
                                    { id: 'inferd', label: 'InferD' },
                                ]}
                                required
                                sx={{ width: '300px' }}
                            />
                            <ControlledInput
                                name="modelIdOnHost"
                                label="Model host Id (The ID of this model on the host)"
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
                                label="Description"
                                fullWidth
                                controllerProps={{ rules: { required: true } }}
                            />

                            <RadioButtonGroup
                                name="promptType"
                                label="Prompt type"
                                options={[
                                    { id: 'text_only', label: 'Text only' },
                                    { id: 'multimodal', label: 'Multimodal' },
                                ]}
                                onChange={(value) => {
                                    setPromptTypeState(value);
                                }}
                                row
                            />
                            {promptTypeState === 'multimodal' && <MultiModalFields />}
                            <Controller
                                name="availability"
                                control={formContext.control}
                                render={({ field }) => (
                                    <Select
                                        label="Availability"
                                        items={availability}
                                        placeholder="Availability"
                                    />
                                )}
                            />
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
