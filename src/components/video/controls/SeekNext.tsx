import { SkipNextRounded } from '@mui/icons-material';

import { StyledTooltip } from '@/components/StyledTooltip';

import { ControlButton } from './ControlButton';
import type { JumpBasedOnCurrentFn } from './useOnKeyDownControls';

export const SeekNext = ({ jumpBasedOnCurrent }: { jumpBasedOnCurrent: JumpBasedOnCurrentFn }) => {
    const handlePress = () => {
        jumpBasedOnCurrent('forward');
    };

    const tooltipLabel = 'Jump the next frame with points';

    return (
        <StyledTooltip content={tooltipLabel} placement='top'>
            <ControlButton onPress={handlePress} aria-label={tooltipLabel}>
                <SkipNextRounded />
            </ControlButton>
        </StyledTooltip>
    );
};
