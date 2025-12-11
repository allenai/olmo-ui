import { SkipPreviousRounded } from '@mui/icons-material';
import { memo } from 'react';

import { StyledTooltip } from '@/components/StyledTooltip';

import { useControls } from './context/ControlsContext';
import { useCurrentFrame } from './context/useCurrentFrame';
import { useTimeline } from './context/useTimeline';
import { ControlButton } from './ControlButton';

export const SeekPrevious = memo(function SeekPrevious() {
    const { isDisabled } = useControls();
    const frame = useCurrentFrame();
    const { jumpBasedOnCurrent } = useTimeline();

    const handlePress = () => {
        jumpBasedOnCurrent('back');
    };

    const tooltipLabel = 'Jump to the previous frame with points';
    const isButtonDisabled = isDisabled || frame === 0;

    return (
        <StyledTooltip
            delay={600}
            content={tooltipLabel}
            placement="top"
            wrapChildrenWithFocus={isButtonDisabled}>
            <ControlButton
                isDisabled={isButtonDisabled}
                onPress={handlePress}
                aria-label={tooltipLabel}>
                <SkipPreviousRounded />
            </ControlButton>
        </StyledTooltip>
    );
});
