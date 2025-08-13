/**
 * A small wrapper around `FeatureToggleButton` for toggling between raw and formatted
 * message display modes.
 *
 * @example
 * <RawToggleButton
 *   isRawMode={isRawMode}
 *   setRawMode={setRawMode}
 * />
 *
 * @param {RawToggleButtonProps} props - Component props.
 * @returns {JSX.Element} The rendered toggle button.
 */

import { FormatClear, TitleRounded } from '@mui/icons-material';
import { ReactNode } from 'react';

import { FlatMessage } from '@/api/playgroundApi/thread';

import { FeatureToggleButton } from './FeatureToggleButton';

/**
 * Props for the {@link RawToggleButton} component.
 */
interface RawToggleButtonProps {
    /** The ID of the message this toggle controls. Included for API symmetry with other toggle buttons. */
    messageId: FlatMessage['id'];

    /** Whether this is the last button in a list, used for potential mobile tooltip behavior. */
    isLastButton?: boolean;

    /** Whether raw display mode is active. */
    isRawMode: boolean;

    /** State setter to toggle raw display mode. */
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
