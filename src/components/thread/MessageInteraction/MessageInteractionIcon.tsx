import { SvgIconComponent } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { StyledTooltip } from '@/components/StyledTooltip';

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
        <StyledTooltip title={tooltip} placement="top">
            <IconButton onClick={onClick} aria-pressed={selected} aria-label={tooltip}>
                <Icon color="primary" />
            </IconButton>
        </StyledTooltip>
    );
};
