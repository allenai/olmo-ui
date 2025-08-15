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
    const arrow = hasArrow ? <ExpandArrow /> : null;
    return (
        <CollapsibleWidgetBase {...rest}>
            <CollapsibleWidgetHeading endAdornment={arrow} className={headingClassName}>
                {heading}
            </CollapsibleWidgetHeading>
            <CollapsibleWidgetPanel className={panelClassName}>
                <CollapsibleWidgetPanelContent className={contentClassName}>
                    {children}
                </CollapsibleWidgetPanelContent>
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
