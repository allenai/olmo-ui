import { type ReactNode } from 'react';

import { CollapsibleWidgetBase, type CollapsibleWidgetBaseProps } from './CollapsibleWidgetBase';
import { CollapsibleWidgetFooter } from './CollapsibleWidgetFooter';
import { CollapsibleWidgetHeading } from './CollapsibleWidgetHeading';
import { CollapsibleWidgetPanel, CollapsibleWidgetPanelContent } from './CollapsibleWidgetPanel';
import { ExpandArrow } from './ExpandArrow';

interface CollapsibleWidgetProps extends CollapsibleWidgetBaseProps {
    children?: ReactNode;
    heading: ReactNode;
    hasArrow?: boolean;
    footer?: ReactNode;
    // parts classNames:
    headingClassName?: string;
    panelClassName?: string;
}

const CollapsibleWidget = ({
    heading,
    hasArrow = true,
    footer,
    children,
    headingClassName,
    panelClassName,
    ...rest
}: CollapsibleWidgetProps) => {
    const arrow = hasArrow ? <ExpandArrow /> : null;
    return (
        <CollapsibleWidgetBase {...rest}>
            <CollapsibleWidgetHeading endAdornment={arrow}>{heading}</CollapsibleWidgetHeading>
            <CollapsibleWidgetPanel>
                <CollapsibleWidgetPanelContent>{children}</CollapsibleWidgetPanelContent>
            </CollapsibleWidgetPanel>
            {footer ? (
                <CollapsibleWidgetFooter bordered={true}>{footer}</CollapsibleWidgetFooter>
            ) : null}
        </CollapsibleWidgetBase>
    );
};

export { CollapsibleWidget };
export type { CollapsibleWidgetBaseProps };
