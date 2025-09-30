import { Link, SelectListBoxItem, Stack } from '@allenai/varnish-ui';
import { Autocomplete, TextField } from '@mui/material';
import { ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { SchemaCreateMultiModalModelConfigRequest } from '@/api/playgroundApi/playgroundApiSchema';
import { ControlledInput } from '@/components/form/ControlledInput';
import { ControlledSelect } from '@/components/form/ControlledSelect';
import { ControlledSwitch } from '@/components/form/ControlledSwitch';

import { FileSizeInput } from './inputs/FileSizeInput/FileSizeInput';

const mimeTypeRegex = /^[\w.-]+\/[\w+.-\\*]+$/;

export type MultiModalFormValues = Partial<
    Pick<
        SchemaCreateMultiModalModelConfigRequest,
        | 'acceptedFileTypes'
        | 'allowFilesInFollowups'
        | 'requireFileToPrompt'
        | 'maxFilesPerMessage'
        | 'maxTotalFileSize'
    >
>;

export const MultiModalFields = (): ReactNode => {
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
                        value={field.value as string[] | undefined}
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
