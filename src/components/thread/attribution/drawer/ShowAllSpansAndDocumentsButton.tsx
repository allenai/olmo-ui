import { Button } from '@mui/material';

import { useAppContext } from '@/AppContext';

export const ShowAllSpansAndDocumentsButton = (): JSX.Element | null => {
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
            fullWidth={false}>
            Show all spans and documents
        </Button>
    );
};
