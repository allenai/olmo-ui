import { styled } from '@allenai/varnish-panda-runtime/jsx';
import { Button } from 'react-aria-components';

export const ControlButton = styled(Button, {
    base: {
        display: 'flex',
        color: 'text', // should be `icon.default`, which are the same colors
        cursor: 'pointer',
        borderRadius: 'full',
        transition: '[color 0.2s]',
        _hover: {
            _notDisabled: {
                color: 'links.hovered',
            },
        },
        _disabled: {
            cursor: 'auto',
            color: 'elements.disabled.fill',
        },
    },
});
