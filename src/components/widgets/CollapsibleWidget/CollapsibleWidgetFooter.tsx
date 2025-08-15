import { cva, RecipeVariantProps } from '@allenai/varnish-panda-runtime/css';
import { cx } from '@allenai/varnish-ui';
import { HTMLAttributes } from 'react';

const collapsibleWidgetFooterRecipe = cva({
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

type CollapsibleWidgetFooterVariantProps = Exclude<
    RecipeVariantProps<typeof collapsibleWidgetFooterRecipe>,
    undefined
>;

interface CollapsibleWidgetFooterProps
    extends HTMLAttributes<HTMLDivElement>,
        CollapsibleWidgetFooterVariantProps {
    className?: string;
}

const CollapsibleWidgetFooter = ({
    className,
    children,
    variant,
    bordered,
    ...rest
}: CollapsibleWidgetFooterProps) => {
    const collapsibleWidgetFooterClassName = collapsibleWidgetFooterRecipe({ variant, bordered });
    return (
        <div className={cx(collapsibleWidgetFooterClassName, className)} {...rest}>
            {children}
        </div>
    );
};

export { CollapsibleWidgetFooter };
export type { CollapsibleWidgetFooterProps, CollapsibleWidgetFooterVariantProps };
