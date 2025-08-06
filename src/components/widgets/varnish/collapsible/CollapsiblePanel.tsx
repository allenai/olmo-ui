import { cx } from '@allenai/varnish-ui';
import { HTMLAttributes } from 'react';
import {
    DisclosurePanel as AriaDisclosurePanel,
    DisclosurePanelProps as AriaDisclosurePanelProps,
} from 'react-aria-components';

import { collapsibleRecipe } from './collapsible.styles';

interface CollapsiblePanelContentProps extends HTMLAttributes<HTMLDivElement> {
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

interface CollapsiblePanelProps extends AriaDisclosurePanelProps {
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
