import { Tooltip, TooltipProps } from '@allenai/varnish-ui';

import { useColorMode } from './ColorModeProvider';
import { useDesktopOrUp } from './dolma/shared';

interface StyledTooltipProps extends Omit<TooltipProps, 'children'> {
    desktopPlacement?: TooltipProps['placement'];
    children: React.ReactNode;
}

const StyledTooltip = ({
    placement = 'bottom',
    desktopPlacement = placement,
    ...props
}: StyledTooltipProps) => {
    const { colorMode } = useColorMode();
    const isDesktop = useDesktopOrUp();
    const responsivePlacement = isDesktop ? desktopPlacement : placement;

    return <Tooltip className={colorMode} {...props} placement={responsivePlacement} delay={50} />;
};

export { StyledTooltip, type StyledTooltipProps };
