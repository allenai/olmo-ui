import { css } from '@allenai/varnish-panda-runtime/css';
import { AddCircleRounded } from '@mui/icons-material';
import { Button } from 'react-aria-components';

const varnishPlaygroundButtonStyles = css({
    cursor: 'pointer',
    padding: '1',
    borderRadius: 'full',
    color: 'accent.secondary',
    _hover: { color: 'teal.100' },
    _focusVisible: { outline: '1px solid' },
});

export const AddMediaButton = ({ isDisabled }: { isDisabled?: boolean }) => {
    return (
        <Button isDisabled={isDisabled} className={varnishPlaygroundButtonStyles}>
            <AddCircleRounded color="inherit" />
        </Button>
    );
};
