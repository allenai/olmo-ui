import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import { PromptButton } from '../PromptButton';

interface AcceptOrCancelButtonsProps {
    stopRecording: () => void;
    cancelRecording: () => void;
}

export const AcceptOrCancelButtons = ({
    stopRecording,
    cancelRecording,
}: AcceptOrCancelButtonsProps) => {
    return (
        <>
            <PromptButton
                onClick={() => {
                    cancelRecording();
                }}
                disableRipple={true}
                color="default"
                size="small"
                sx={{
                    color: (theme) => theme.palette.text.primary,
                    ':hover': {
                        color: 'var(--palette-light-accent-secondary)',
                    },
                }}>
                <CloseIcon fontSize="small" sx={{ margin: 0.25 }} />
            </PromptButton>
            <PromptButton
                onClick={() => {
                    stopRecording();
                }}
                disableRipple={true}
                size="large">
                <CheckIcon fontSize="small" sx={{ margin: 0.25 }} />
            </PromptButton>
        </>
    );
};
