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
            <PromptButton onPress={cancelRecording}>
                <CloseIcon fontSize="small" sx={{ margin: 0.25 }} />
            </PromptButton>
            <PromptButton onPress={stopRecording}>
                <CheckIcon fontSize="small" sx={{ margin: 0.25 }} />
            </PromptButton>
        </>
    );
};
