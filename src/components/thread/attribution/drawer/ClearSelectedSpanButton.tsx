import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';

import { useAppContext } from '@/AppContext';

export const ClearSelectedSpanButton = (): JSX.Element | null => {
    const resetSelectedSpan = useAppContext((state) => state.resetCorpusLinkSelection);
    const hasSelection = useAppContext((state) => state.attribution.selection != null);

    if (!hasSelection) {
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
