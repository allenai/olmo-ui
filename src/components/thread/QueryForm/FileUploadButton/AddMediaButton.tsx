import { css } from '@allenai/varnish-panda-runtime/css';
import { AddCircleRounded } from '@mui/icons-material';
import { Button } from 'react-aria-components';

const varnishPlaygroundButtonStyles = css({
    display: 'flex',
    cursor: 'pointer',
    padding: '1',
    borderRadius: 'full',
    color: 'accent.secondary',
    _hover: {
        _notDisabled: {
            color: 'teal.100',
        },
    },
    _focusVisible: { outline: '1px solid' },
    _disabled: { color: 'elements.disabled.fill' },
});

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
        <Button
            onPress={onPress}
            isDisabled={isDisabled}
            className={varnishPlaygroundButtonStyles}
            aria-label={ariaLabel}
            data-testid="file-upload-btn">
            <AddCircleRounded color="inherit" />
        </Button>
    );
};
