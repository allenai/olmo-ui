import { css } from '@allenai/varnish-panda-runtime/css';
import { Tooltip, TooltipProps } from '@allenai/varnish-ui';
import { ReactNode } from 'react';

import { useDesktopOrUp } from './dolma/shared';

interface StyledTooltipProps extends Omit<TooltipProps, 'children' | 'arrow'> {
    desktopPlacement?: TooltipProps['placement'];
    children: ReactNode;
    arrow?: boolean;
}

const StyledTooltip = ({
    placement = 'bottom',
    desktopPlacement = placement,
    arrow = true,
    ...props
}: StyledTooltipProps) => {
    const isDesktop = useDesktopOrUp();
    const responsivePlacement = isDesktop ? desktopPlacement : placement;

    return (
        <Tooltip
            className={tooltipClass}
            arrow={arrow}
            {...props}
            placement={responsivePlacement}
            delay={50}
        />
    );
};

export { StyledTooltip, type StyledTooltipProps };

const tooltipClass = css({
    maxWidth: '[300px]',
});
