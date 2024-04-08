import Snackbar from '@mui/material/Snackbar';

import { Box } from '@mui/material';

interface ParameterSnackBarProps {
    parametersChanged: boolean;
    setParametersChanged: (parametersChanged: boolean) => void;
}
export const ParameterSnackBar = ({
    parametersChanged,
    setParametersChanged,
}: ParameterSnackBarProps) => {
    const handleClose = (_event: React.SyntheticEvent | Event) => {
        setTimeout(() => {
            setParametersChanged(false);
        }, 60000);
    };

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
