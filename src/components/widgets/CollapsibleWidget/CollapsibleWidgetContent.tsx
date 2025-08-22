import { cx } from '@allenai/varnish-ui';
import { HTMLAttributes } from 'react';

import {
    collapsibleWidgetRecipe,
    type CollapsibleWidgetRecipeVariantProps,
} from './collapsibleWidget.styles';

interface CollapsibleWidgetContentProps
    extends CollapsibleWidgetRecipeVariantProps,
        HTMLAttributes<HTMLDivElement> {
    className?: string;
}

const CollapsibleWidgetContent = ({
    className,
    children,
    ...rest
}: CollapsibleWidgetContentProps) => {
    const [variantProps, localProps] = collapsibleWidgetRecipe.splitVariantProps(rest);
    const classNames = collapsibleWidgetRecipe(variantProps);
    return (
        <div className={cx(classNames.panelContent, className)} {...localProps}>
            {children}
        </div>
    );
};

export { CollapsibleWidgetContent };
export type { CollapsibleWidgetContentProps };
