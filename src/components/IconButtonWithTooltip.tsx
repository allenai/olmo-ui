import { varnishTheme } from '@allenai/varnish2/theme';
import { alpha, IconButton, IconButtonOwnProps, SxProps, Theme } from '@mui/material';
import { MouseEventHandler } from 'react';

import { StyledTooltip, type StyledTooltipProps } from './StyledTooltip';

type IconButtonWithTooltipProps = Pick<IconButtonOwnProps, 'color' | 'disabled'> &
    Pick<StyledTooltipProps, 'children' | 'arrow' | 'placement' | 'desktopPlacement'> & {
        label: string;
        sx?: SxProps<Theme>;
        isActive?: boolean;
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
    isActive = false,
    ...rest
}: IconButtonWithTooltipProps) => {
    return (
        <StyledTooltip
            title={label}
            arrow={arrow}
            placement={placement}
            desktopPlacement={desktopPlacement}>
            <IconButton
                {...rest}
                color={color}
                sx={[
                    (theme) => ({
                        '&[data-active="true"]': {
                            backgroundColor:
                                theme.palette.mode === 'light'
                                    ? varnishTheme.palette.background.paper
                                    : alpha(theme.palette.common.white, 0.1),
                            borderRadius: '10px',
                        },
                    }),
                    // Array.isArray doesn't preserve Sx's array type
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    ...(Array.isArray(sx) ? sx : [sx]),
                ]}
                data-active={isActive}>
                {children}
            </IconButton>
        </StyledTooltip>
    );
};
