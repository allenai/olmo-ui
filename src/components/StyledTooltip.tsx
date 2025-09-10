import { css } from '@allenai/varnish-panda-runtime/css';
import { cx, Tooltip, TooltipProps } from '@allenai/varnish-ui';
import { ReactNode } from 'react';

import { useColorMode } from './ColorModeProvider';
import { useDesktopOrUp } from './dolma/shared';

interface StyledTooltipProps extends Omit<TooltipProps, 'children'> {
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
    const { colorMode } = useColorMode();
    const isDesktop = useDesktopOrUp();
    const responsivePlacement = isDesktop ? desktopPlacement : placement;

    return (
        <Tooltip
            className={cx(colorMode, tooltipClass)}
            {...props}
            placement={responsivePlacement}
            delay={50}
            arrowClassName={!arrow ? noArrowClass : undefined}
        />
    );
};

export { StyledTooltip, type StyledTooltipProps };

const noArrowClass = css({
    display: 'none !important',
});

const tooltipClass = css({
    maxWidth: '[300px]',
});
