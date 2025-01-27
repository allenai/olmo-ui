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
import { MouseEventHandler, PropsWithChildren } from 'react';

import { useDesktopOrUp } from './dolma/shared';

type IconButtonWithTooltipProps = PropsWithChildren & {
    color?: IconButtonOwnProps['color'];
    disabled?: IconButtonOwnProps['disabled'];
    label: string;
    arrow?: TooltipProps['arrow'];
    leftOnDesktop?: boolean;
    sx?: SxProps<Theme>;
} & ({ href?: never; onClick: MouseEventHandler<HTMLElement> } | { href: string; onClick?: never });

export const IconButtonWithTooltip = ({
    color = 'primary',
    label,
    sx,
    arrow = true,
    children,
    leftOnDesktop = false,
    ...rest
}: IconButtonWithTooltipProps) => {
    const isDesktop = useDesktopOrUp();
    const placement = leftOnDesktop && isDesktop ? 'left' : 'bottom';

    return (
        <StyledTooltip title={label} arrow={arrow} placement={placement}>
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
