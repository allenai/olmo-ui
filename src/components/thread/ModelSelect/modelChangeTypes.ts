import { SelectChangeEvent } from '@mui/material';

// Shared output contract for model change hooks
export interface ModelChangeHookResult {
    handleModelChange: (event: SelectChangeEvent) => void;
    ModelSwitchWarningModal: () => JSX.Element;
}
