import { cx } from '@allenai/varnish-ui';
import { HTMLAttributes } from 'react';
import {
    DisclosurePanel as AriaDisclosurePanel,
    DisclosurePanelProps as AriaDisclosurePanelProps,
} from 'react-aria-components';

import { collapsibleWidgetRecipe } from './collapsibleWidget.styles';

interface CollapsibleWidgetPanelContentProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
}

const CollapsibleWidgetPanelContent = ({
    className,
    children,
    ...rest
}: CollapsibleWidgetPanelContentProps) => {
    const [variantProps, localProps] = collapsibleWidgetRecipe.splitVariantProps(rest);
    const classNames = collapsibleWidgetRecipe(variantProps);
    return (
        <div className={cx(classNames.panelContent, className)} {...localProps}>
            {children}
        </div>
    );
};

interface CollapsibleWidgetPanelProps extends AriaDisclosurePanelProps {
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

export { CollapsibleWidgetPanel, CollapsibleWidgetPanelContent };
export type { CollapsibleWidgetPanelContentProps, CollapsibleWidgetPanelProps };
