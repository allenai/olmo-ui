import { SkipNextRounded } from '@mui/icons-material';
import { memo } from 'react';
import { Focusable } from 'react-aria-components';

import { StyledTooltip } from '@/components/StyledTooltip';

import { ControlButton } from './ControlButton';
import type { JumpBasedOnCurrentFn } from './useOnKeyDownControls';

interface SeekNextProps {
    isDisabled?: boolean;
    jumpBasedOnCurrent: JumpBasedOnCurrentFn;
}

export const SeekNext = memo(function SeekNext({ isDisabled, jumpBasedOnCurrent }: SeekNextProps) {
    const handlePress = () => {
        jumpBasedOnCurrent('forward');
    };

    const tooltipLabel = 'Jump to the next frame with points';

    return (
        <StyledTooltip content={tooltipLabel} placement="top">
            <Focusable>
                <ControlButton
                    isDisabled={isDisabled}
                    onPress={handlePress}
                    aria-label={tooltipLabel}>
                    <SkipNextRounded />
                </ControlButton>
            </Focusable>
        </StyledTooltip>
    );
});
