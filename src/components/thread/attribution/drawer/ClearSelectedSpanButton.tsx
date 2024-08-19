import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';

import { useAppContext } from '@/AppContext';

export const ClearSelectedSpanButton = (): JSX.Element | null => {
    const resetSelectedSpan = useAppContext((state) => state.resetSelectedSpan);
    const hasSelectedSpan = useAppContext((state) => state.attribution.selectedSpanId != null);

    if (!hasSelectedSpan) {
        return null;
    }

    return (
        <Button
            variant="contained"
            onClick={() => {
                resetSelectedSpan();
            }}
            size="medium"
            endIcon={<CloseIcon />}
            sx={{
                width: 'fit-content',
            }}>
            Clear selection
        </Button>
    );
};
