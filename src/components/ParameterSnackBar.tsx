import Snackbar from '@mui/material/Snackbar';

import { Box } from '@mui/material';

import { useAppContext } from '@/AppContext';

export const ParameterSnackBar = () => {
    const isParameterChanged = useAppContext((state) => state.isParameterChanged);
    const setIsParameterChanged = useAppContext((state) => state.setIsParameterChanged);

    const handleClose = (_event: React.SyntheticEvent | Event) => {
        setIsParameterChanged(false);
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
