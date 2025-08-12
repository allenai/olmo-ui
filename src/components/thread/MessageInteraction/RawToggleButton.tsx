/**
 * A small wrapper around `FeatureToggleButton` for toggling between
 * raw and formatted message display modes.
 *
 * - `selected` state reflects whether raw mode is currently enabled.
 * - Clicking the button calls `setRawMode` with the new state.
 * - Icon and tooltip content change depending on `isRawMode`:
 *   - Raw mode on (`isRawMode = true`): Shows a "TitleRounded" icon and
 *     hint `"Display Formatted"`.
 *   - Raw mode off (`isRawMode = false`): Shows a "FormatClear" icon and
 *     hint `"Clear Formatting"`.
 *
 * Props:
 * - isRawMode: Whether raw display mode is active.
 * - setRawMode: State setter to toggle raw mode.
 * - messageId, `isLastButton`: Present in the interface for symmetry with other
 *   toggle buttons, but not currently used in the component.
 *
 * Common Usage:
 * <RawToggleButton
 *   isRawMode={isRawMode}
 *   setRawMode={setRawMode}
 * />
 */

import { FormatClear, TitleRounded } from '@mui/icons-material';
import { ReactNode } from 'react';

import { FlatMessage } from '@/api/playgroundApi/thread';

import { FeatureToggleButton } from './FeatureToggleButton';

interface RawToggleButtonProps {
    messageId: FlatMessage['id'];
    isLastButton?: boolean;
    isRawMode: boolean;
    setRawMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RawToggleButton = ({ isRawMode, setRawMode }: RawToggleButtonProps): ReactNode => {
    const toolTipText = isRawMode ? 'Display Formatted' : 'Clear Formatting';

    return (
        <FeatureToggleButton
            selected={isRawMode}
            onChange={setRawMode}
            iconOn={<TitleRounded />}
            iconOff={<FormatClear />}
            hint={toolTipText}
            mobileTooltip={toolTipText}
            buttonProps={{ sx: { padding: 1 } }}
        />
    );
};
