import { cva, RecipeVariantProps } from '@allenai/varnish-panda-runtime/css';
import { cx } from '@allenai/varnish-ui';
import { PropsWithChildren } from 'react';

const collapsibleFooterRecipe = cva({
    base: {
        display: 'flex',
        paddingInline: '4',
        paddingBlock: '3',
        fontSize: 'sm', // correct token: `contained2`
    },
    variants: {
        variant: {
            default: {
                backgroundColor: 'cream.4', // wrong name, right color
            },
            alternate: {
                backgroundColor: 'extra-dark-teal.70',
            },
        },
        bordered: {
            true: {
                borderTop: '[1px solid]',
                borderTopColor: 'elements.faded.stroke',
            },
        },
    },
    defaultVariants: {
        variant: 'default',
        bordered: false,
    },
});

type CollapsibleFooterVariantProps = Exclude<
    RecipeVariantProps<typeof collapsibleFooterRecipe>,
    undefined
>;

interface CollapsibleFooterProps extends PropsWithChildren, CollapsibleFooterVariantProps {
    className?: string;
}

const CollapsibleFooter = ({ className, children, variant, bordered }: CollapsibleFooterProps) => {
    const collapsibleFooterClassName = collapsibleFooterRecipe({ variant, bordered });
    return <div className={cx(collapsibleFooterClassName, className)}>{children}</div>;
};

export { CollapsibleFooter };
export type { CollapsibleFooterProps, CollapsibleFooterVariantProps };
