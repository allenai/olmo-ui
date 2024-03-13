import { Button, Checkbox, FormControlLabel, Grid, Stack, TextField } from '@mui/material';
import { ChangeEventHandler, FormEventHandler, MouseEventHandler } from 'react';

interface NewQueryFormProps {
    onSubmit: FormEventHandler;
    isFormDisabled?: boolean;
    onPromptChange: ChangeEventHandler<HTMLInputElement>;
    onParametersButtonClick: MouseEventHandler;
}

export const NewQueryForm = ({
    onSubmit,
    isFormDisabled,
    onPromptChange,
    onParametersButtonClick,
}: NewQueryFormProps): JSX.Element => {
    return (
        <>
            <Grid container component="form" gap={1} onSubmit={onSubmit} id="prompt">
                <TextField
                    fullWidth
                    multiline
                    minRows={10}
                    disabled={isFormDisabled}
                    placeholder="Select a Prompt Template above or type a free form prompt"
                    value={prompt}
                    onChange={onPromptChange}
                    InputProps={{
                        sx: {
                            height: '100%',
                            alignItems: 'flex-start',
                        },
                    }}
                />
            </Grid>
            <Grid item container gap={2}>
                <Button variant="contained" type="submit" form="prompt" disabled={isFormDisabled}>
                    Prompt
                </Button>
                <FormControlLabel
                    sx={{ marginLeft: 'auto' }}
                    control={
                        <Checkbox
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
        </>
    );
};
