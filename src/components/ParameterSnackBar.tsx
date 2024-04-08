import Snackbar from '@mui/material/Snackbar';

import { Box } from '@mui/material';

interface ParameterSnackBarProps {
    isParameterChanged: boolean;
    setIsParameterChanged: (isParameterChanged: boolean) => void;
}
export const ParameterSnackBar = ({
    isParameterChanged,
    setIsParameterChanged,
}: ParameterSnackBarProps) => {
    const handleClose = (_event: React.SyntheticEvent | Event) => {
        setTimeout(() => {
            setIsParameterChanged(false);
        }, 60000);
    };

    return (
        <Box>
            <Snackbar
                open={isParameterChanged}
                autoHideDuration={6000}
                onClose={handleClose}
                message="Parameters Saved"
            />
        </Box>
    );
};
