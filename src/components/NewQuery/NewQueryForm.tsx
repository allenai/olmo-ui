import {
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    IconButton,
    MenuItem,
    Select,
    TextField,
    Tooltip,
} from '@mui/material';
import { ChangeEventHandler, FormEventHandler, MouseEventHandler, ReactNode } from 'react';
import { Model } from 'src/api/Model';
import { DefaultPromptTemplate, PromptTemplate } from 'src/api/PromptTemplate';

import { useForm, FormContainer, SelectElement, TextFieldElement } from 'react-hook-form-mui';
import { MessagePost } from 'src/api/Message';

interface NewQueryFormProps {
    onSubmit: (data: MessagePost) => void;
    isFormDisabled?: boolean;
    onPromptChange: ChangeEventHandler<HTMLInputElement>;
    onParametersButtonClick: MouseEventHandler;
    models: Model[];
    promptTemplates: PromptTemplate[];
    topRightFormControls?: ReactNode;
}

export const NewQueryForm = ({
    onSubmit,
    isFormDisabled,
    onPromptChange,
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

    return (
        <FormContainer formContext={formContext} onSuccess={(data) => onSubmit(data)}>
            <Grid container item gap={2} justifyContent="space-between">
                <Tooltip
                    title={
                        models.find((model) => model.id === formContext.getValues('model'))
                            ?.description
                    }
                    placement="top">
                    <SelectElement
                        sx={{
                            flex: '1 1 min-content',
                        }}
                        name="model"
                        disabled={isFormDisabled}>
                        {models.map((model) => {
                            return (
                                <MenuItem key={model.id} value={model.id}>
                                    {model.name}
                                </MenuItem>
                            );
                        })}
                    </SelectElement>
                </Tooltip>

                <Select
                    defaultValue={DefaultPromptTemplate.id}
                    disabled={isFormDisabled}
                    sx={{
                        flex: '1 1 min-content',
                    }}
                    // onChange={(evt) => {
                    //     if (formContext.formState.isDirty) {
                    //         // we have a dirty prompt, prevent the change?
                    //         setPromptTemplateIdSwitchingTo(evt.target.value);
                    //         setIsPromptAlertOpen(true);
                    //     } else {
                    //         setSelectedPromptTemplateId(evt.target.value);
                    //     }
                    // }}
                >
                    {promptTemplates.map((pt) => {
                        return (
                            <MenuItem key={pt.id} value={pt.id}>
                                {pt.name}
                            </MenuItem>
                        );
                    })}
                </Select>
                {topRightFormControls}
            </Grid>
            <Grid container gap={1}>
                <TextFieldElement
                    fullWidth
                    multiline
                    minRows={10}
                    disabled={isFormDisabled}
                    placeholder="Select a Prompt Template above or type a free form prompt"
                    value={prompt}
                    onChange={onPromptChange}
                    name="content"
                    InputProps={{
                        sx: {
                            height: '100%',
                            alignItems: 'flex-start',
                        },
                    }}
                />

                <Grid item container gap={2} height="min-content">
                    <Button variant="contained" type="submit" disabled={isFormDisabled}>
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
