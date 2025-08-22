import { type ReactNode } from 'react';

import {
    collapsibleWidgetRecipe,
    type CollapsibleWidgetRecipeVariantProps,
} from './collapsibleWidget.styles';
import { CollapsibleWidgetBase, type CollapsibleWidgetBaseProps } from './CollapsibleWidgetBase';
import { CollapsibleWidgetContent } from './CollapsibleWidgetContent';
import { CollapsibleWidgetFooter } from './CollapsibleWidgetFooter';
import { CollapsibleWidgetHeading } from './CollapsibleWidgetHeading';
import { CollapsibleWidgetPanel } from './CollapsibleWidgetPanel';
import { ExpandArrow } from './ExpandArrow';

interface CollapsibleWidgetProps
    extends CollapsibleWidgetRecipeVariantProps,
        CollapsibleWidgetBaseProps {
    children?: ReactNode;
    heading: ReactNode;
    hasArrow?: boolean;
    footer?: ReactNode;
    // parts classNames:
    headingClassName?: string;
    panelClassName?: string;
    contentClassName?: string;
    footerClassName?: string;
}

const CollapsibleWidget = ({
    heading,
    hasArrow = true,
    footer,
    children,
    headingClassName,
    panelClassName,
    contentClassName,
    footerClassName,
    ...rest
}: CollapsibleWidgetProps) => {
    const [variantProps, localProps] = collapsibleWidgetRecipe.splitVariantProps(rest);
    const arrow = hasArrow ? <ExpandArrow /> : null;
    return (
        <CollapsibleWidgetBase {...localProps}>
            <CollapsibleWidgetHeading endAdornment={arrow} className={headingClassName}>
                {heading}
            </CollapsibleWidgetHeading>
            <CollapsibleWidgetPanel className={panelClassName} {...variantProps}>
                <CollapsibleWidgetContent className={contentClassName}>
                    {children}
                </CollapsibleWidgetContent>
            </CollapsibleWidgetPanel>
            {footer ? (
                <CollapsibleWidgetFooter bordered={true} className={footerClassName}>
                    {footer}
                </CollapsibleWidgetFooter>
            ) : null}
        </CollapsibleWidgetBase>
    );
};

export { CollapsibleWidget };
export type { CollapsibleWidgetBaseProps };
