import { css } from '@allenai/varnish-panda-runtime/css';
import { cx } from '@allenai/varnish-ui';
import type { HTMLAttributes } from 'react';

const linkCardList = css({
    container: 'inline-size',
    display: 'grid',
    '--max-width': '30%',

    gridTemplateColumns: {
        base: '1fr',
        md: 'repeat(auto-fit, minmax(min(100%, var(--max-width, 30%)), 1fr))',
    },
    gap: '3',
});

export const LinkCardList = ({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className={cx(linkCardList, className)} {...rest}>
            {children}
        </div>
    );
};
