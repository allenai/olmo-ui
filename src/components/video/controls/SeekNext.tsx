import { SkipNextRounded } from '@mui/icons-material';
import { memo } from 'react';

import { StyledTooltip } from '@/components/StyledTooltip';

import { useControls } from './context/ControlsContext';
import { useCurrentFrame } from './context/useCurrentFrame';
import { useTimeline } from './context/useTimeline';
import { ControlButton } from './ControlButton';

export const SeekNext = memo(function SeekNext() {
    const { isDisabled } = useControls();
    const frame = useCurrentFrame();
    const { durationInFrames, jumpBasedOnCurrent } = useTimeline();

    const handlePress = () => {
        jumpBasedOnCurrent('forward');
    };

    const tooltipLabel = 'Jump to the next frame with points';
    const isButtonDisabled = isDisabled || frame === durationInFrames - 1;

    return (
        <StyledTooltip
            delay={600}
            content={tooltipLabel}
            placement="top"
            isDisabled={isDisabled}
            wrapChildrenWithFocus={isButtonDisabled}>
            <ControlButton
                isDisabled={isButtonDisabled}
                onPress={handlePress}
                aria-label={tooltipLabel}>
                <SkipNextRounded />
            </ControlButton>
        </StyledTooltip>
    );
});
