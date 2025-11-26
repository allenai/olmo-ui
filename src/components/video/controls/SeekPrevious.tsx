import { SkipPreviousRounded } from '@mui/icons-material';
import { Focusable } from 'react-aria-components';

import { StyledTooltip } from '@/components/StyledTooltip';

import { ControlButton } from './ControlButton';
import type { JumpBasedOnCurrentFn } from './useOnKeyDownControls';

interface SeekPreviousProps {
    isDisabled?: boolean;
    jumpBasedOnCurrent: JumpBasedOnCurrentFn;
}

export const SeekPrevious = ({ isDisabled, jumpBasedOnCurrent }: SeekPreviousProps) => {
    const handlePress = () => {
        jumpBasedOnCurrent('back');
    };

    const tooltipLabel = 'Jump the previous frame with points';

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
};
