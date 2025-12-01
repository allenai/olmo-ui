import { SkipNextRounded } from '@mui/icons-material';
import { memo } from 'react';

import { StyledTooltip } from '@/components/StyledTooltip';

import { useCurrentFrame } from './context/useCurrentFrame';
import { useTimeline } from './context/useTimeline';
import { ControlButton } from './ControlButton';

export const SeekNext = memo(function SeekNext() {
    const frame = useCurrentFrame();
    const { durationInFrames, jumpBasedOnCurrent } = useTimeline();

    const handlePress = () => {
        jumpBasedOnCurrent('forward');
    };

    const tooltipLabel = 'Jump to the next frame with points';
    const isDisabled = frame === durationInFrames - 1;

    return (
        <StyledTooltip content={tooltipLabel} placement="top" wrapChildrenWithFocus={isDisabled}>
            <ControlButton isDisabled={isDisabled} onPress={handlePress} aria-label={tooltipLabel}>
                <SkipNextRounded />
            </ControlButton>
        </StyledTooltip>
    );
});
