import { css } from '@allenai/varnish-panda-runtime/css';
import { Tooltip, TooltipProps } from '@allenai/varnish-ui';
import { ReactNode } from 'react';
import { Focusable } from 'react-aria-components';

import { useDesktopOrUp } from './dolma/shared';

interface StyledTooltipProps extends Omit<TooltipProps, 'children' | 'arrow'> {
    id?: string;
    desktopPlacement?: TooltipProps['placement'];
    children: ReactNode;
    arrow?: boolean;
    wrapChildrenWithFocus?: boolean;
}

const StyledTooltip = ({
    placement = 'bottom',
    desktopPlacement = placement,
    arrow = true,
    wrapChildrenWithFocus,
    children,
    ...props
}: StyledTooltipProps) => {
    const isDesktop = useDesktopOrUp();
    const responsivePlacement = isDesktop ? desktopPlacement : placement;

    // We aren't really supposed to have tooltips on disabled elements, according to WAI-ARIA
    // RAC enforces this as well. Wrapping the children allows us to keep this functionality.
    // We want to only do it when we have disabled state on the children, or we get double focus
    // from the span and the children when they are enabled, so it is enabled via a prop.
    const wrappedChildren = wrapChildrenWithFocus ? (
        <Focusable>
            <span>{children}</span>
        </Focusable>
    ) : (
        children
    );

    return (
        <Tooltip
            className={tooltipClass}
            arrow={arrow}
            placement={responsivePlacement}
            delay={50}
            {...props}>
            {wrappedChildren}
        </Tooltip>
    );
};

export { StyledTooltip, type StyledTooltipProps };

const tooltipClass = css({
    maxWidth: '[300px]',
});
