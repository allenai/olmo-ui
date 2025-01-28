import {
    IconButton,
    IconButtonOwnProps,
    styled,
    SxProps,
    Theme,
    Tooltip,
    tooltipClasses,
    TooltipProps,
} from '@mui/material';
import { MouseEventHandler } from 'react';

import { useDesktopOrUp } from './dolma/shared';

type IconButtonWithTooltipProps = Pick<IconButtonOwnProps, 'color' | 'disabled'> &
    Pick<TooltipProps, 'children' | 'arrow' | 'placement'> & {
        label: string;
        desktopPlacement?: TooltipProps['placement'];
        sx?: SxProps<Theme>;
    } & (
        | { href?: never; onClick: MouseEventHandler<HTMLElement> }
        | { href: string; onClick?: never }
    );

export const IconButtonWithTooltip = ({
    color = 'primary',
    label,
    sx,
    arrow = true,
    placement = 'bottom',
    desktopPlacement = placement,
    children,
    ...rest
}: IconButtonWithTooltipProps) => {
    const isDesktop = useDesktopOrUp();
    const responsivePlacement = isDesktop ? desktopPlacement : placement;

    return (
        <StyledTooltip title={label} arrow={arrow} placement={responsivePlacement}>
            <IconButton {...rest} color={color} sx={sx}>
                {children}
            </IconButton>
        </StyledTooltip>
    );
};

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        ...theme.typography.caption,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.background.default,
    },
}));
