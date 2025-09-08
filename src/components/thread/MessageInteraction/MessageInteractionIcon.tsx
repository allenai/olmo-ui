import { css } from '@allenai/varnish-panda-runtime/css';
import { IconButton } from '@allenai/varnish-ui';
import { SvgIconComponent } from '@mui/icons-material';

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
        <StyledTooltip content={tooltip} placement="top">
            <IconButton
                className={iconButtonClass}
                onClick={onClick}
                aria-pressed={selected}
                aria-label={tooltip}
                color="primary"
                variant="text">
                <Icon />
            </IconButton>
        </StyledTooltip>
    );
};

const iconButtonClass = css({
    padding: '2',
});
