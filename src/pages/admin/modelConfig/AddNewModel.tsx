import { Button } from '@allenai/varnish-ui';
import { Autocomplete, Box, Stack, TextField } from '@mui/material';
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

import { ModelClient } from '@/api/Model';
import { SchemaRootCreateModelConfigRequest } from '@/api/playgroundApi/playgroundApiSchema';
import { DatePicker } from '@/components/datepicker/DatePicker';
import { StandardModal } from '@/components/StandardModal';

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

interface AddNewModelProps {
    open: boolean;
    onClose: () => void;
}

export const AddNewModel = ({ open, onClose }: AddNewModelProps) => {
    const formContext = useForm<SchemaRootCreateModelConfigRequest>({
        defaultValues: {
            promptType: 'text_only',
        },
        mode: 'onChange',
    });

    const [promptTypeState, setPromptTypeState] = React.useState<string>();
    const [showTimeSection, setShowTimeSection] = React.useState<boolean>(false);
    const modelClient = new ModelClient();

    const handleSubmit = (formData: SchemaRootCreateModelConfigRequest) => {
        console.log(formData);
        modelClient.addModel(formData).then(() => {
            onClose();
            formContext.reset();
        });
    };
    return (
        <StandardModal open={open}>
            <FormContainer formContext={formContext} onSuccess={handleSubmit}>
                <Stack spacing={3}>
                    <Box flexDirection="row" display="flex" gap={2}>
                        <TextFieldElement
                            name="name"
                            control={formContext.control}
                            label="Name"
                            variant="standard"
                            required
                            fullWidth
                            InputLabelProps={{ shrink: true, sx: { fontSize: '18px' } }}
                        />
                        <TextFieldElement
                            name="id"
                            control={formContext.control}
                            label="ID"
                            variant="standard"
                            required
                            fullWidth
                            InputLabelProps={{ shrink: true, sx: { fontSize: '18px' } }}
                            placeholder="The ID you see when linking to this model"
                        />
                    </Box>
                    <Autocomplete
                        options={['Olmo', 'Tulu']}
                        renderInput={(params) => {
                            return <TextField {...params} label="Model family" />;
                        }}
                        sx={{ width: '300px' }}
                        freeSolo
                    />
                    <Box flexDirection="row" display="flex" gap={2}>
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
                        <TextFieldElement
                            name="modelIdOnHost"
                            control={formContext.control}
                            label="Model host ID"
                            variant="standard"
                            required
                            InputLabelProps={{ shrink: true, sx: { fontSize: '18px' } }}
                            placeholder="The ID of this model on the host"
                            sx={{ flex: 1 }}
                        />
                    </Box>
                    <TextFieldElement
                        name="description"
                        control={formContext.control}
                        label="Description"
                        variant="standard"
                        required
                        fullWidth
                        InputLabelProps={{ shrink: true, sx: { fontSize: '18px' } }}
                    />
                    <TextFieldElement
                        name="defaultSystemPrompt"
                        control={formContext.control}
                        label="Default system prompt"
                        variant="standard"
                        fullWidth
                        InputLabelProps={{ shrink: true, sx: { fontSize: '18px' } }}
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
                    <SelectElement
                        name="availability"
                        label="Availability"
                        options={[
                            { id: 'public', label: 'Public' },
                            { id: 'internal', label: 'Internal' },
                            { id: 'prerelease', label: 'Pre-release' },
                        ]}
                        onChange={(value) => {
                            if (value === 'public') {
                                formContext.setValue('internal', false);
                                formContext.setValue('availableTime', null);
                                formContext.setValue('deprecationTime', null);
                                setShowTimeSection(false);
                            } else if (value === 'internal') {
                                formContext.setValue('internal', true);
                                formContext.setValue('availableTime', null);
                                formContext.setValue('deprecationTime', null);
                                setShowTimeSection(false);
                            } else if (value === 'prerelease') {
                                formContext.setValue('internal', false);
                                setShowTimeSection(true);
                            }
                        }}
                        required
                        fullWidth
                    />
                    {showTimeSection && renderTimeSection(formContext)}
                    <Box flexDirection="row" display="flex" gap={2}>
                        <Button variant="outlined" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" type="submit">
                            Save
                        </Button>
                    </Box>
                </Stack>
            </FormContainer>
        </StandardModal>
    );
};
