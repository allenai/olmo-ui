import { cva } from '@allenai/varnish-panda-runtime/css';
import type { RecipeVariantProps } from '@allenai/varnish-panda-runtime/types';
import { cx } from '@allenai/varnish-ui';
import { type HTMLAttributes } from 'react';

const collapsibleWidgetFooterRecipe = cva({
    base: {
        display: 'flex',
        paddingInline: '4',
        paddingBlock: '3',
        fontSize: 'sm',
        backgroundColor: 'elements.overlay.footer',
    },
    variants: {
        bordered: {
            true: {
                borderTop: '[1px solid]',
                borderTopColor: 'elements.faded.stroke',
            },
        },
    },
    defaultVariants: {
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
