import { IconButton, IconButtonOwnProps, SxProps, Theme, Tooltip } from '@mui/material';
import { MouseEventHandler, PropsWithChildren } from 'react';

type IconButtonWithTooltipProps = PropsWithChildren & {
    color?: IconButtonOwnProps['color'];
    disabled?: IconButtonOwnProps['disabled'];
    label: string;
    sx?: SxProps<Theme>;
} & ({ href?: never; onClick: MouseEventHandler<HTMLElement> } | { href: string; onClick?: never });

export const IconButtonWithTooltip = ({
    color = 'primary',
    label,
    sx,
    children,
    ...rest
}: IconButtonWithTooltipProps) => {
    return (
        <Tooltip title={label}>
            <IconButton {...rest} color={color} sx={sx}>
                {children}
            </IconButton>
        </Tooltip>
    );
};
