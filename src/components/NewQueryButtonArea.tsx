import React from 'react';
import { Button, Checkbox, FormControlLabel, Grid } from '@mui/material';

import { useFeatureToggles } from '../FeatureToggleContext';

interface NewQueryButtonAreaProps {
    isLoading: boolean;
    postNewMessage: () => Promise<void>;
    showParams: boolean;
    setShowParams: (showParams: boolean) => void;
    isPrivateChecked: boolean;
    onPrivateCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const NewQueryButtonArea = ({
    isLoading,
    postNewMessage,
    showParams,
    setShowParams,
    isPrivateChecked,
    onPrivateCheckboxChange,
}: NewQueryButtonAreaProps) => {
    const toggles = useFeatureToggles();
    if (toggles.privateToggles) {
        return (
            <Grid display="flex" justifyContent="center">
                <Button variant="contained" onClick={() => postNewMessage()} disabled={isLoading}>
                    Prompt
                </Button>
                <span />
                <FormControlLabel
                    sx={{ marginLeft: 'auto' }}
                    control={
                        <Checkbox
                            checked={isPrivateChecked}
                            onChange={(e) => onPrivateCheckboxChange(e)}
                            inputProps={{
                                'aria-label': 'Mark this Query Private',
                            }}
                        />
                    }
                    label="Private"
                />
                <Button variant="outlined" onClick={() => setShowParams(!showParams)}>
                    Parameters
                </Button>
            </Grid>
        );
    }
    return (
        <Grid display="grid" gridTemplateColumns="auto 1fr auto">
            <Button variant="contained" onClick={() => postNewMessage()} disabled={isLoading}>
                Prompt
            </Button>
            <span />
            <Button variant="outlined" onClick={() => setShowParams(!showParams)}>
                Parameters
            </Button>
        </Grid>
    );
};
