import { css } from '@allenai/varnish-panda-runtime/css';
import { cx } from '@allenai/varnish-ui';
import { PropsWithChildren } from 'react';

const cardClassName = css({
    display: 'grid',
    gap: '4',
    appearance: 'none',
    backgroundColor: 'elements.overlay.background',
    padding: '4',
    borderRadius: 'lg',
    fontWeight: 'medium',
});

export const GenericCard = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
    return <div className={cx(cardClassName, className)}>{children}</div>;
};
