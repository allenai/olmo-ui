
import { Controller, FormContainer, RadioButtonGroup, SelectElement, SwitchElement, useForm, UseFormReturn } from 'react-hook-form-mui';
import { Autocomplete, Box, Input, InputLabel, Stack, TextField } from '@mui/material';
import { StandardModal } from '@/components/StandardModal';
import { SchemaRootCreateModelConfigRequest } from '@/api/playgroundApi/playgroundApiSchema';
import React from 'react';
import { DatePicker } from '@/components/datepicker/DatePicker';
import { Button } from '@allenai/varnish-ui';

const renderMultiModalSection = (formContext: UseFormReturn<SchemaRootCreateModelConfigRequest>) => {
    return (
        <>
            <Controller
                name="acceptedFileTypes"
                control={formContext.control}
                render={({ field }) =>
                    <Autocomplete id={field.name} multiple freeSolo
                        options={[".jpg", ".png", "*"]}
                        renderInput={(params) => {
                            return < TextField
                                {...params}
                                label="Accepted file types"
                            />
                        }}
                    />
                }
            />
            <SelectElement
                name="requireFileToPrompt"
                label='File prompt requirement'
                options={[{ id: 'first_message', label: 'First message' }, { id: 'all_messages', label: 'All messages' }, { id: 'no_requirement', label: 'No requirement' }]}
            />
            <Box flexDirection="row" display="flex" gap={10}>
                <SwitchElement
                    name="allowFilesInFollowups"
                    label="Allow files in followup prompts"
                    control={formContext.control}
                />
                <Controller
                    name="maxFilesPerMessage"
                    control={formContext.control}
                    render={({ field }) => <TextfieldItem itemName={field.name} itemLabel='Max files per message' type="number" variant="outlined" {...field} />}
                />
            </Box>

        </>
    )
}

const renderTimeSection = (formContext: UseFormReturn<SchemaRootCreateModelConfigRequest>) => {
    return <Box flexDirection="row" display="flex" gap={10}>
        <Controller
            name="availableTime"
            control={formContext.control}
            render={({ field }) => <DatePicker labelText='Available time' />}
        />
        <Controller
            name="deprecationTime"
            control={formContext.control}
            render={({ field }) => <DatePicker labelText='Deprecation time' />}
        />
    </Box>
}

const TextfieldItem = ({
    itemName,
    itemLabel,
    isRequired,
    ...extra
}: {
    itemName: string,
    itemLabel: string,
    isRequired?: boolean,
}) => {
    return <Stack flex={1}>
        <InputLabel required={isRequired} htmlFor={itemName}>{itemLabel}</InputLabel>
        <Input required={isRequired} {...extra} id={itemName} />
    </Stack>
}

export const AddNewModel = () => {
    const formContext = useForm<SchemaRootCreateModelConfigRequest>({
        defaultValues: {
            id: "",
            name: "",
            modelIdOnHost: "",
            description: "",
            promptType: "text_only"
        },
        mode: 'onChange',
    });

    const [promptTypeState, setPromptTypeState] = React.useState<string>()
    const [showTimeSection, setShowTimeSection] = React.useState<boolean>(false)

    const handleSubmit = (formData: SchemaRootCreateModelConfigRequest) => {
        console.log(formData)
    }
    return (
        <StandardModal open={true}>
            <FormContainer formContext={formContext} onSuccess={handleSubmit}>
                <Stack spacing={3}>
                    <Box flexDirection="row" display="flex" gap={2}>
                        <Controller
                            name="name"
                            control={formContext.control}
                            render={({ field }) => <TextfieldItem itemName={field.name} itemLabel='Name' isRequired={true} {...field} />}
                        />
                        <Controller
                            name="id"
                            control={formContext.control}
                            render={({ field }) =>
                                <TextfieldItem itemName={field.name} itemLabel='ID' isRequired={true} {...field} placeholder='The ID you see when linking to this model' />
                            }
                        />
                    </Box>
                    <Autocomplete
                        options={["Olmo", "Tulu"]}
                        renderInput={(params) => {
                            return < TextField
                                {...params}
                                label="Model family"
                            />
                        }}
                        sx={{ width: '300px' }}
                    />
                    <Box flexDirection="row" display="flex" gap={2}>
                        <SelectElement
                            name='host'
                            label='Model host'
                            control={formContext.control}
                            options={[{ id: 'modal', label: 'Modal' }, { id: 'inferd', label: 'InferD' }]}
                            required
                            sx={{ width: '300px' }}
                        />
                        <Controller
                            name="modelIdOnHost"
                            control={formContext.control}
                            render={({ field }) => <TextfieldItem itemName={field.name} itemLabel='Model host ID (The ID of this model on the host)' isRequired={true} {...field} />}
                        />
                    </Box>


                    <Controller
                        name="description"
                        control={formContext.control}
                        render={({ field }) => <TextfieldItem itemName={field.name} itemLabel='Description' isRequired={true} {...field} />}
                    />
                    <Controller
                        name="defaultSystemPrompt"
                        control={formContext.control}
                        render={({ field }) => <TextfieldItem itemName={field.name} itemLabel='Default system prompt' {...field} />}
                    />
                    {/* <SelectElement
                        name="promptType"
                        label='Prompt type'
                        options={[{ id: 'text_only', label: 'Text only' }, { id: 'multimodal', label: 'Multimodal' }]}
                        onChange={(value) => {
                            console.log(value)
                            setPromptTypeState(value)
                        }}
                        required
                        fullWidth
                    /> */}
                    <RadioButtonGroup
                        name="promptType"
                        label='Prompt type'
                        options={[{ id: 'text_only', label: 'Text only' }, { id: 'multimodal', label: 'Multimodal' }]}
                        onChange={(value) => {
                            console.log(value)
                            setPromptTypeState(value)
                        }}
                        row />
                    {promptTypeState === 'multimodal' && renderMultiModalSection(formContext)}
                    <SelectElement
                        name='availability'
                        label='Availability'
                        options={[{ id: 'public', label: 'Public' }, { id: 'internal', label: 'Internal' }, { id: 'prerelease', label: 'Pre-release' }]}
                        onChange={(value) => {
                            if (value == 'public') {
                                formContext.setValue('internal', false)
                                formContext.setValue('availableTime', null)
                                formContext.setValue('deprecationTime', null)
                                setShowTimeSection(false)
                            } else if (value == 'internal') {
                                formContext.setValue('internal', true)
                                formContext.setValue('availableTime', null)
                                formContext.setValue('deprecationTime', null)
                                setShowTimeSection(false)
                            } else if (value == 'prerelease') {
                                formContext.setValue('internal', false)
                                setShowTimeSection(true)
                            }
                        }}
                        required
                        fullWidth
                    />
                    {showTimeSection && renderTimeSection(formContext)}
                    <Box flexDirection="row" display="flex" gap={2}>
                        <Button
                            variant="outlined"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            type="submit"
                        >
                            Save
                        </Button>
                    </Box>
                </Stack>
            </FormContainer>
        </StandardModal>
    );
};
