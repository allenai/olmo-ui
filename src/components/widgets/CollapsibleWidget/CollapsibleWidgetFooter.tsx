import { cva } from '@allenai/varnish-panda-runtime/css';
import type { RecipeVariantProps } from '@allenai/varnish-panda-runtime/types';
import { cx } from '@allenai/varnish-ui';
import { type HTMLAttributes } from 'react';

import { CollapsibleWidgetContent } from './CollapsibleWidgetContent';

const collapsibleWidgetFooterRecipe = cva({
    base: {
        display: 'flex',
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

const CollapsibleWidgetFooterBase = ({
    className,
    children,
    bordered,
    ...rest
}: CollapsibleWidgetFooterProps) => {
    const collapsibleWidgetFooterClassName = collapsibleWidgetFooterRecipe({ bordered });
    return (
        <div className={cx(collapsibleWidgetFooterClassName, className)} {...rest}>
            {children}
        </div>
    );
};

const CollapsibleWidgetFooter = ({ children, ...rest }: CollapsibleWidgetFooterProps) => (
    <CollapsibleWidgetFooterBase {...rest}>
        <CollapsibleWidgetContent contrast="off">{children}</CollapsibleWidgetContent>
    </CollapsibleWidgetFooterBase>
);

export { CollapsibleWidgetFooter, CollapsibleWidgetFooterBase };
export type { CollapsibleWidgetFooterProps, CollapsibleWidgetFooterVariantProps };
