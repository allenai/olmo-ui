import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';

import { useAppContext } from '@/AppContext';
import { hasSelectedSpansSelector } from '@/slices/attribution/attribution-selectors';

export const ClearSelectedSpanButton = (): JSX.Element | null => {
    const resetSelectedSpan = useAppContext((state) => state.resetSelectedSpans);
    const hasSelectedSpan = useAppContext(hasSelectedSpansSelector);

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
