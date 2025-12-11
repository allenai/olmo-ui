import { css } from '@allenai/varnish-panda-runtime/css';
import { cx } from '@allenai/varnish-ui';
import { type ForwardedRef, forwardRef } from 'react';
import { Button, type ButtonProps } from 'react-aria-components';

const promptButtonStyles = css({
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
    _disabled: { cursor: 'auto', color: 'icon.disabled' },
});

export const PromptButton = forwardRef(function PromptButton(
    { className, children, ...props }: ButtonProps & { className?: string },
    ref: ForwardedRef<HTMLButtonElement>
) {
    return (
        <Button ref={ref} className={cx(promptButtonStyles, className)} {...props}>
            {children}
        </Button>
    );
});
