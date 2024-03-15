import { Button, Checkbox, FormControlLabel, Grid } from '@mui/material';
import { MouseEventHandler, ReactNode, useContext, useEffect } from 'react';

import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';

import { Model } from '../../api/Model';
import { PromptTemplate } from '../../api/PromptTemplate';

import { MessagePost } from '../../api/Message';

import { RepromptActionContext } from '../../contexts/repromptActionContext';
import { TemplateSelect } from './TemplateSelect';
import { ModelSelect } from './ModelSelect';

interface NewQueryFormProps {
    onSubmit: (data: MessagePost) => Promise<void>;
    isFormDisabled?: boolean;
    onParametersButtonClick: MouseEventHandler;
    models: Model[];
    promptTemplates: PromptTemplate[];
    topRightFormControls?: ReactNode;
}

export const NewQueryForm = ({
    onSubmit,
    isFormDisabled,
    onParametersButtonClick,
    models,
    promptTemplates,
    topRightFormControls = null,
}: NewQueryFormProps): JSX.Element => {
    const formContext = useForm({
        defaultValues: {
            model: models[0].id,
            content: '',
            private: false,
        },
    });

    const { repromptText } = useContext(RepromptActionContext);

    useEffect(() => {
        formContext.setValue('content', repromptText);
    }, [repromptText]);

    const handlePromptTemplateChange = (templateId: string) => {
        const template = promptTemplates.find((template) => templateId === template.id);

        if (template == null) {
            // TODO: Handle this edge case
            return;
        }

        formContext.setValue('content', template.content);
    };

    const handleSubmit = async (data: MessagePost) => {
        await onSubmit(data);
        formContext.setValue('content', '');
    };

    const isFormDisabledOrLoading = isFormDisabled || formContext.formState.isSubmitting;

    return (
        <FormContainer
            formContext={formContext}
            onSuccess={(data) => handleSubmit(data)}
            // Using style instead of styled or sx because rhf-mui doesn't support it well
            FormProps={{ style: { height: '100%' } }}>
            <Grid
                container
                gap={1}
                display="grid"
                gridTemplateRows="min-content 1fr min-content"
                sx={{ height: 1 }}>
                <Grid container item gap={2} justifyContent="space-between">
                    <ModelSelect disabled={isFormDisabledOrLoading} />
                    <TemplateSelect
                        promptTemplates={promptTemplates}
                        onChange={handlePromptTemplateChange}
                    />
                    {topRightFormControls}
                </Grid>
                <TextFieldElement
                    fullWidth
                    multiline
                    minRows={10}
                    disabled={isFormDisabledOrLoading}
                    placeholder="Select a Prompt Template above or type a free form prompt"
                    value={prompt}
                    name="content"
                    InputProps={{
                        sx: {
                            height: '100%',
                            alignItems: 'flex-start',
                        },
                    }}
                />

                <Grid item container gap={2} height="min-content">
                    <Button variant="contained" type="submit" disabled={isFormDisabledOrLoading}>
                        Prompt
                    </Button>
                    <FormControlLabel
                        sx={{ marginLeft: 'auto' }}
                        control={
                            <Checkbox
                                name="private"
                                inputProps={{
                                    'aria-label': 'Mark this Query Private',
                                }}
                            />
                        }
                        label="Private"
                    />
                    <Button variant="outlined" onClick={onParametersButtonClick}>
                        Parameters
                    </Button>
                </Grid>
            </Grid>
        </FormContainer>
    );
};
