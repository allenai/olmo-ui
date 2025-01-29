import { Tooltip, TooltipProps } from '@mui/material';

import { useDesktopOrUp } from './dolma/shared';

type StyledTooltipProps = TooltipProps & {
    desktopPlacement?: TooltipProps['placement'];
};

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
            {...props}
            arrow={arrow}
            placement={responsivePlacement}
            slotProps={{
                tooltip: {
                    sx: (theme) => ({
                        ...theme.typography.caption,
                        backgroundColor: theme.palette.background.reversed,
                        color: theme.palette.text.reversed,
                        boxShadow: 'none',
                    }),
                },
                arrow: {
                    sx: (theme) => ({
                        color: theme.palette.background.reversed,
                        boxShadow: 'none',
                    }),
                },
            }}
        />
    );
};

export { StyledTooltip, type StyledTooltipProps };
