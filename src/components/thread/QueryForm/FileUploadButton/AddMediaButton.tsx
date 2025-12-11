import { AddOutlined } from '@mui/icons-material';

import { PromptButton } from '../PromptButton';

interface AddMediaButtonProps {
    isDisabled?: boolean;
    'aria-label'?: string;
    onPress?: () => void;
}

export const AddMediaButton = ({
    onPress,
    isDisabled,
    'aria-label': ariaLabel,
}: AddMediaButtonProps) => {
    return (
        <PromptButton
            onPress={onPress}
            isDisabled={isDisabled}
            aria-label={ariaLabel}
            data-testid="file-upload-btn">
            <AddOutlined color="inherit" />
        </PromptButton>
    );
};
