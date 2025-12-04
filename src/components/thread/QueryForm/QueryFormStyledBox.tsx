import { css, cva } from '@allenai/varnish-panda-runtime/css';
import type { PropsWithChildren, ReactNode } from 'react';

const queryFormStyledBox = cva({
    base: {
        display: 'flex',
        borderRadius: '[{spacing.7}]',
        paddingBlock: '2',
        paddingInline: '4',
        background: 'elements.overrides.form.input.fill',
        border: '2px solid transparent',
        '&:has(:focus-visible)': {
            borderColor: 'accent.secondary',
        },
        '@supports not (selector(:focus-visible) or selector(:has(*)))': {
            _focusWithin: {
                borderColor: 'accent.secondary',
            },
        },
    },
    variants: {
        isModal: {
            true: {
                position: 'absolute',
                bottom: '[0]',
                width: '[100%]',
                maxHeight: '[70dvh]',
            },
        },
    },
});

export const QueryFormStyledBox = ({
    children,
    isModal,
}: PropsWithChildren<{ isModal?: boolean }>): ReactNode => {
    return (
        // relative wrapper for the QueryForm to "pop" out of
        <div
            className={css({
                position: 'relative',
                marginInline: '4',
            })}>
            <div className={queryFormStyledBox({ isModal })}>{children}</div>
        </div>
    );
};
