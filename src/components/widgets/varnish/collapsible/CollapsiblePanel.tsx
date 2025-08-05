import { cx } from '@allenai/varnish-ui';
import { type PropsWithChildren } from 'react';
import { DisclosurePanel as AriaDisclosurePanel } from 'react-aria-components';

import { collapsibleRecipe } from './collapsible.styles';

interface CollapsiblePanelContentProps extends PropsWithChildren {
    className?: string;
}

const CollapsiblePanelContent = ({
    className,
    children,
    ...rest
}: CollapsiblePanelContentProps) => {
    const [variantProps, localProps] = collapsibleRecipe.splitVariantProps(rest);
    const classNames = collapsibleRecipe(variantProps);
    return (
        <div className={cx(classNames.panelContent, className)} {...localProps}>
            {children}
        </div>
    );
};

interface CollapsiblePanelProps extends PropsWithChildren {
    className?: string;
}

const CollapsiblePanel = ({ className, children, ...rest }: CollapsiblePanelProps) => {
    const [variantProps, localProps] = collapsibleRecipe.splitVariantProps(rest);
    const classNames = collapsibleRecipe(variantProps);
    return (
        <AriaDisclosurePanel className={cx(classNames.panel, className)} {...localProps}>
            {children}
        </AriaDisclosurePanel>
    );
};

export { CollapsiblePanel, CollapsiblePanelContent };
export type { CollapsiblePanelContentProps, CollapsiblePanelProps };
