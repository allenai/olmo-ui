import { Button, Input, Select, Stack } from '@allenai/varnish-ui';
import { Autocomplete, Box, TextField } from '@mui/material';
import React from 'react';
import {
    Controller,
    FormContainer,
    RadioButtonGroup,
    SelectElement,
    SwitchElement,
    TextFieldElement,
    useForm,
    UseFormReturn,
} from 'react-hook-form-mui';
import { useSubmit } from 'react-router-dom';

import { ModelClient } from '@/api/Model';
import { SchemaRootCreateModelConfigRequest } from '@/api/playgroundApi/playgroundApiSchema';
import { DatePicker } from '@/components/datepicker/DatePicker';
import { MetaTags } from '@/components/MetaTags';

const renderMultiModalSection = (
    formContext: UseFormReturn<SchemaRootCreateModelConfigRequest>
) => {
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

const renderTimeSection = (formContext: UseFormReturn<SchemaRootCreateModelConfigRequest>) => {
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
            <Stack spacing={8} direction="row" wrap="wrap">
                <FormContainer formContext={formContext} onSuccess={handleSubmit}>
                    <Stack spacing={8} direction="column">
                        <Controller
                            name="name"
                            control={formContext.control}
                            render={({ field }) => (
                                <Input label="Name" value={field.value} fullWidth={true} />
                            )}
                        />
                        <Controller
                            name="id"
                            control={formContext.control}
                            render={({ field }) => (
                                <Input
                                    label="ID (The ID you see when linking to this model)"
                                    value={field.value}
                                    fullWidth={true}
                                />
                            )}
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
                        <Controller
                            name="modelIdOnHost"
                            control={formContext.control}
                            render={({ field }) => (
                                <Input
                                    label="Model host Id (The ID of this model on the host)"
                                    value={field.value}
                                    fullWidth={true}
                                />
                            )}
                        />

                        <Controller
                            name="description"
                            control={formContext.control}
                            render={({ field }) => (
                                <Input label="Description" value={field.value} fullWidth={true} />
                            )}
                        />
                        <Controller
                            name="defaultSystemPrompt"
                            control={formContext.control}
                            render={({ field }) => (
                                <Input
                                    label="Default system prompt"
                                    value={field.value}
                                    fullWidth={true}
                                />
                            )}
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
                        {promptTypeState === 'multimodal' && renderMultiModalSection(formContext)}
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
                        {showTimeSection && renderTimeSection(formContext)}
                        <Stack direction="row" align="center" justify="center" spacing={3}>
                            <Button variant="outlined">Cancel</Button>
                            <Button variant="contained" type="submit">
                                Save
                            </Button>
                        </Stack>
                    </Stack>
                </FormContainer>
            </Stack>
        </>
    );
};
