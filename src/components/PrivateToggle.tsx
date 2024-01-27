import React from 'react';

import { Checkbox, FormControlLabel, Typography } from '@mui/material';

import { useFeatureToggles } from '../FeatureToggleContext';

interface PrivateToggleProps {
    isPrivateChecked: boolean;
    queriesView: string;
    onPrivateCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PrivateToggle = ({
    isPrivateChecked,
    queriesView,
    onPrivateCheckboxChange,
}: PrivateToggleProps) => {
    const toggles = useFeatureToggles();
    if (toggles.privateToggles && queriesView === 'mine') {
        return (
            <FormControlLabel
                control={
                    <Checkbox
                        checked={isPrivateChecked}
                        onChange={onPrivateCheckboxChange}
                        inputProps={{
                            'aria-label': 'Toggle Private Queries',
                        }}
                        sx={{ color: 'white' }}
                    />
                }
                label={<Typography sx={{ color: 'white' }}>Private Queries</Typography>}
            />
        );
    }
    return null;
};
