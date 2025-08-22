import { cx } from '@allenai/varnish-ui';
import {
    DisclosurePanel as AriaDisclosurePanel,
    DisclosurePanelProps as AriaDisclosurePanelProps,
} from 'react-aria-components';

import {
    collapsibleWidgetRecipe,
    type CollapsibleWidgetRecipeVariantProps,
} from './collapsibleWidget.styles';

interface CollapsibleWidgetPanelProps
    extends CollapsibleWidgetRecipeVariantProps,
        AriaDisclosurePanelProps {
    className?: string;
}

const CollapsibleWidgetPanel = ({ className, children, ...rest }: CollapsibleWidgetPanelProps) => {
    const [variantProps, localProps] = collapsibleWidgetRecipe.splitVariantProps(rest);
    const classNames = collapsibleWidgetRecipe(variantProps);
    return (
        <AriaDisclosurePanel className={cx(classNames.panel, className)} {...localProps}>
            {children}
        </AriaDisclosurePanel>
    );
};

export { CollapsibleWidgetPanel };
export type { CollapsibleWidgetPanelProps };
