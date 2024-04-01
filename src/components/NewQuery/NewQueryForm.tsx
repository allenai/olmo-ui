import { Button, Checkbox, FormControlLabel, Grid } from '@mui/material';
import { MouseEventHandler, ReactNode, useEffect } from 'react';

import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';

import { useAppContext } from '../../AppContext';

import { MessagePost } from '../../api/Message';

import { ModelSelect } from './ModelSelect';
import { TemplateSelect } from './TemplateSelect';
import { ParameterButton } from '../ParameterButton';

interface NewQueryFormProps {
    onSubmit: (data: MessagePost) => Promise<void>;
    isFormDisabled?: boolean;
    onParametersButtonClick: MouseEventHandler;
    topRightFormControls?: ReactNode;
}

export const useNewQueryFormHandling = () => {
    const models = useAppContext((state) => state.modelInfo.data);

    const formContext = useForm({
        defaultValues: {
            model: models?.[0].id,
            content: '',
            private: false,
        },
    });

    useEffect(() => {
        if (models != null) {
            formContext.reset({ model: models[0].id });
        }
    }, [models]);

    const repromptText = useAppContext((state) => state.repromptText);

    useEffect(() => {
        formContext.setValue('content', repromptText);
    }, [repromptText]);

    return formContext;
};

export const NewQueryForm = ({
    onSubmit,
    isFormDisabled,
    onParametersButtonClick,
    topRightFormControls = null,
}: NewQueryFormProps): JSX.Element => {
    const formContext = useNewQueryFormHandling();

    const handlePromptTemplateChange = (templateContent: string) => {
        formContext.setValue('content', templateContent);
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
            FormProps={{ style: { height: '100%' }, 'aria-label': 'Prompt input and options' }}>
            <Grid
                container
                gap={1}
                display="grid"
                gridTemplateRows="min-content 1fr min-content"
                sx={{ height: 1 }}>
                <Grid container item gap={2} justifyContent="space-between">
                    <ModelSelect disabled={isFormDisabledOrLoading} />
                    <TemplateSelect onChange={handlePromptTemplateChange} />
                    {topRightFormControls}
                </Grid>
                <TextFieldElement
                    fullWidth
                    multiline
                    minRows={10}
                    disabled={isFormDisabledOrLoading}
                    placeholder="Select a Prompt Template above or type a free form prompt"
                    name="content"
                    InputProps={{
                        sx: {
                            height: '100%',
                            alignItems: 'flex-start',
                        },
                    }}
                    inputProps={{
                        'data-testid': 'Prompt',
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
                    {/* <Button variant="outlined" onClick={onParametersButtonClick}>
                        Parameters
                    </Button> */}
                    <ParameterButton />
                </Grid>
            </Grid>
        </FormContainer>
    );
};
