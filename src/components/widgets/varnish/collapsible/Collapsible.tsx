import { type ReactNode } from 'react';

import { CollapsibleBase, type CollapsibleBaseProps } from './CollapsibleBase';
import { CollapsibleFooter } from './CollapsibleFooter';
import { CollapsibleHeading } from './CollapsibleHeading';
import { CollapsiblePanel, CollapsiblePanelContent } from './CollapsiblePanel';
import { ExpandArrow } from './ExpandArrow';

interface CollapsibleProps extends CollapsibleBaseProps {
    children?: ReactNode;
    heading: ReactNode;
    hasArrow?: boolean;
    footer?: ReactNode;
    // parts classNames:
    headingClassName?: string;
    panelClassName?: string;
}

const Collapsible = ({
    heading,
    hasArrow = true,
    footer,
    children,
    headingClassName,
    panelClassName,
    ...rest
}: CollapsibleProps) => {
    return (
        <CollapsibleBase {...rest}>
            <CollapsibleHeading>
                {heading}
                {hasArrow ? <ExpandArrow /> : null}
            </CollapsibleHeading>
            <CollapsiblePanel>
                <CollapsiblePanelContent>{children}</CollapsiblePanelContent>
            </CollapsiblePanel>
            {footer ? <CollapsibleFooter bordered={true}>{footer}</CollapsibleFooter> : null}
        </CollapsibleBase>
    );
};

export { Collapsible };
export type { CollapsibleBaseProps };
