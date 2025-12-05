import { cva } from '@allenai/varnish-panda-runtime/css';
import { cx } from '@allenai/varnish-ui';
import type { HTMLAttributes } from 'react';

const linkCardList = cva({
    base: {
        container: 'inline-size',
        display: 'grid',

        gridTemplateColumns: {
            base: '1fr',
            md: 'repeat(auto-fit, minmax(min(100%, var(--max-width, 30%)), 1fr))',
        },
        gap: '3',
    },
    variants: {
        columns: {
            auto: {},
            two: {
                gridTemplateColumns: {
                    base: '1fr',
                    md: 'repeat(2, 1fr)',
                },
            },
        },
    },
    defaultVariants: {
        columns: 'auto',
    },
});

type LinkCardListProps = HTMLAttributes<HTMLDivElement> & {
    columns?: 'auto' | 'two';
};

export const LinkCardList = ({ columns, className, children, ...rest }: LinkCardListProps) => {
    return (
        <div className={cx(linkCardList({ columns }), className)} {...rest}>
            {children}
        </div>
    );
};
