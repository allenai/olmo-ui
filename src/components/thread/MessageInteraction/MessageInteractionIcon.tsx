import { SvgIconComponent } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

interface MessageInteractionIconProps {
    Icon: SvgIconComponent;
    tooltip: string;
    selected?: boolean;
    onClick: () => void;
}

export const MessageInteractionIcon = ({
    Icon,
    tooltip,
    selected,
    onClick,
}: MessageInteractionIconProps) => {
    return (
        <Tooltip
            title={tooltip}
            placement="top"
            arrow
            slotProps={{
                tooltip: {
                    sx: (theme) => ({
                        backgroundColor: theme.color['dark-teal'].hex,
                        color: theme.color['off-white'].hex,
                        boxShadow: 'none',
                    }),
                },
                arrow: {
                    sx: (theme) => ({
                        color: theme.color['dark-teal'].hex,
                        boxShadow: 'none',
                    }),
                },
            }}>
            <IconButton onClick={onClick} aria-pressed={selected} aria-label={tooltip}>
                <Icon color="primary" />
            </IconButton>
        </Tooltip>
    );
};
