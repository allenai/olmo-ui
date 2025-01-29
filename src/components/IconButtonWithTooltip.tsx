import { IconButton, IconButtonOwnProps, SxProps, Theme } from '@mui/material';
import { MouseEventHandler } from 'react';

import { StyledTooltip, type StyledTooltipProps } from './StyledTooltip';

type IconButtonWithTooltipProps = Pick<IconButtonOwnProps, 'color' | 'disabled'> &
    Pick<StyledTooltipProps, 'children' | 'arrow' | 'placement' | 'desktopPlacement'> & {
        label: string;
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
    return (
        <StyledTooltip
            title={label}
            arrow={arrow}
            placement={placement}
            desktopPlacement={desktopPlacement}>
            <IconButton {...rest} color={color} sx={sx}>
                {children}
            </IconButton>
        </StyledTooltip>
    );
};
