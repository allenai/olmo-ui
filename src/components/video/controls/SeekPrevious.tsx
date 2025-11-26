import { SkipPreviousRounded } from '@mui/icons-material';
import { useId } from 'react';

import { StyledTooltip } from '@/components/StyledTooltip';

import { ControlButton } from './ControlButton';
import type { JumpBasedOnCurrentFn } from './useOnKeyDownControls';

export const SeekPrevious = ({
    isDisabled,
    jumpBasedOnCurrent,
}: {
    isDisabled?: boolean;
    jumpBasedOnCurrent: JumpBasedOnCurrentFn;
}) => {
    const handlePress = () => {
        jumpBasedOnCurrent('back');
    };

    const tooltipLabel = 'Jump the previous frame with points';

    return (
        <StyledTooltip content={tooltipLabel} placement='top'>
            <ControlButton onPress={handlePress} aria-label={tooltipLabel}>
                <SkipPreviousRounded />
            </ControlButton>
        </StyledTooltip>
    );
};
