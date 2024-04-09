import Snackbar from '@mui/material/Snackbar';

import { Box } from '@mui/material';
import { useDebouncedCallback } from 'use-debounce';

interface ParameterSnackBarProps {
    parametersChanged: boolean;
    setParametersChanged: (parametersChanged: boolean) => void;
}
export const ParameterSnackBar = ({
    parametersChanged,
    setParametersChanged,
}: ParameterSnackBarProps) => {
    const handleClose = useDebouncedCallback((_event: React.SyntheticEvent | Event) => {
        setParametersChanged(false);
    }, 5000);

    return (
        <Box>
            <Snackbar
                open={parametersChanged}
                autoHideDuration={6000}
                onClose={handleClose}
                message="Parameters Saved"
            />
        </Box>
    );
};
