import { SkipPreviousRounded } from '@mui/icons-material';
import { memo } from 'react';
import { Focusable } from 'react-aria-components';

import { StyledTooltip } from '@/components/StyledTooltip';

import { useCurrentFrame } from './context/useCurrentFrame';
import { useTimeline } from './context/useTimeline';
import { ControlButton } from './ControlButton';

export const SeekPrevious = memo(function SeekPrevious() {
    const frame = useCurrentFrame();
    const { jumpBasedOnCurrent } = useTimeline();

    const handlePress = () => {
        jumpBasedOnCurrent('back');
    };

    const tooltipLabel = 'Jump to the previous frame with points';
    const isDisabled = frame === 0;

    return (
        <StyledTooltip content={tooltipLabel} placement="top">
            <Focusable>
                <ControlButton
                    isDisabled={isDisabled}
                    onPress={handlePress}
                    aria-label={tooltipLabel}>
                    <SkipPreviousRounded />
                </ControlButton>
            </Focusable>
        </StyledTooltip>
    );
});
