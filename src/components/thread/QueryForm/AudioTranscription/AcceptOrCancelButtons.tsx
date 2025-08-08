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
                size="medium"
                sx={{
                    color: 'var(--palette-light-text-default)',
                    ':hover': {
                        color: 'var(--palette-light-accent-secondary)',
                    },
                }}>
                <CloseIcon fontSize="small" />
            </PromptButton>
            <PromptButton
                onClick={() => {
                    stopRecording();
                }}
                disableRipple={true}
                color="secondary"
                size="medium">
                <CheckIcon fontSize="small" />
            </PromptButton>
        </>
    );
};
