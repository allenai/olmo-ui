import { Button, Stack } from '@mui/material';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';

import { useNewQueryFormHandling } from '../NewQuery/NewQueryForm';

interface QueryFormProps {
    onSubmit: (data: { content: string }) => Promise<void> | void;
}

export const QueryForm = ({ onSubmit }: QueryFormProps): JSX.Element => {
    // TODO: Refactor this to not use model stuff
    const formContext = useNewQueryFormHandling();

    const handleSubmit = async (data: { content: string }) => {
        await onSubmit(data);
        formContext.reset();
    };

    return (
        <FormContainer formContext={formContext} onSuccess={handleSubmit}>
            <Stack gap={3} alignItems="flex-start">
                <TextFieldElement
                    name="content"
                    label="Prompt"
                    placeholder="Enter your prompt here"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    fullWidth
                    multiline
                    minRows={10}
                />
                <Button type="submit" variant="contained">
                    Submit
                </Button>
            </Stack>
        </FormContainer>
    );
};
