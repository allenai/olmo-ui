import { css, cva } from '@allenai/varnish-panda-runtime/css';
import type { PropsWithChildren, ReactNode } from 'react';

const queryFormStyledBox = cva({
    base: {
        '--dropshadow-color': {
            base: 'rgba(0, 0, 0, 0.15)',
            _dark: 'rgba(0, 0, 0, 0.2)', // little darker in dark mode
        },
        display: 'flex',
        borderRadius: '[{spacing.7}]',
        paddingBlock: '2',
        paddingInline: '2',
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
                filter: '[drop-shadow(0px -2px 2px var(--dropshadow-color))]',
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
                // TODO: find a better layout for this
                //
                // I don't like this, but it prevents layout shift
                minHeight: '[calc(1.5rem + 28px)]',
            })}>
            <div className={queryFormStyledBox({ isModal })}>{children}</div>
        </div>
    );
};
