/**
 * A responsive toggle button for enabling or disabling a feature,
 * with different UI/UX on desktop vs. mobile.
 *
 * @example
 * <FeatureToggleButton
 *   selected={isEnabled}
 *   onChange={(next) => setIsEnabled(next)}
 *   labelOn="Hide Details"
 *   labelOff="Show Details"
 *   iconOn={<HideIcon />}
 *   iconOff={<ShowIcon />}
 *   hint="Toggle detail view"
 *   onTrack={(next) => logToggle(next)}
 * />
 *
 * @param {FeatureToggleButtonProps} props - The component props.
 * @returns {JSX.Element} The rendered toggle button.
 */

import { alpha, Button, ButtonProps, IconButton, IconButtonProps } from '@mui/material';
import { ReactNode } from 'react';

import { useDesktopOrUp } from '@/components/dolma/shared';
import { StyledTooltip } from '@/components/StyledTooltip';

/**
 * Props for the {@link FeatureToggleButton} component.
 */
export interface FeatureToggleButtonProps {
    /** Current on/off state of the feature. */
    selected: boolean;

    /** Fired when the control is toggled. Receives the new state. */
    onChange: (next: boolean) => void;

    /** Text label when `selected` is true. */
    labelOn?: string;

    /** Text label when `selected` is false. */
    labelOff?: string;

    /** Icon to display when `selected` is true. */
    iconOn?: ReactNode;

    /** Icon to display when `selected` is false. */
    iconOff?: ReactNode;

    /** Tooltip content shown on desktop. */
    hint?: ReactNode;

    /** Tooltip content shown on mobile (defaults to current label). */
    mobileTooltip?: ReactNode;

    /** Controls mobile tooltip visibility in controlled mode. */
    mobileTooltipOpen?: boolean;

    /** Handler for mobile tooltip visibility changes. */
    onMobileTooltipOpenChange?: (open: boolean) => void;

    /** Tooltip placement relative to the button. */
    placement?: 'top' | 'bottom' | 'left' | 'right';

    /** Whether to force-show the desktop hint tooltip. */
    showHint?: boolean;

    /** Extra props forwarded to the desktop `Button`. */
    buttonProps?: Omit<ButtonProps, 'onClick'>;

    /** Extra props forwarded to the mobile `IconButton`. */
    iconButtonProps?: Omit<IconButtonProps, 'onClick' | 'aria-pressed' | 'aria-label'>;

    /** Accessible label when `selected` is true (mobile). */
    ariaLabelOn?: string;

    /** Accessible label when `selected` is false (mobile). */
    ariaLabelOff?: string;

    /** Optional analytics callback invoked after state changes. */
    onTrack?: (nextSelected: boolean) => void;
}

export function FeatureToggleButton({
    selected,
    onChange,
    labelOn,
    labelOff,
    iconOn,
    iconOff,
    hint,
    mobileTooltip,
    mobileTooltipOpen,
    onMobileTooltipOpenChange,
    placement = 'top',
    showHint = false,
    buttonProps,
    iconButtonProps,
    ariaLabelOn,
    ariaLabelOff,
    onTrack,
}: FeatureToggleButtonProps) {
    const curLabel = selected ? labelOn : labelOff;
    const curIcon = selected ? iconOn : iconOff;
    const isDesktop = useDesktopOrUp();

    const handleClick = () => {
        const next = !selected;
        onChange(next);
        if (onTrack) {
            onTrack(next);
        }
    };

    if (isDesktop) {
        return (
            <StyledTooltip title={hint ?? ''} placement={placement} open={showHint || undefined}>
                <Button
                    variant="text"
                    onClick={handleClick}
                    aria-pressed={selected}
                    title={typeof curLabel === 'string' ? curLabel : undefined}
                    {...buttonProps}
                    sx={[
                        {
                            fontWeight: 'semiBold',
                            color: 'primary.main',
                            gap: 1,
                            padding: 1,
                            '&:hover': {
                                color: 'text.primary',
                                backgroundColor: (theme) =>
                                    theme.palette.mode === 'dark'
                                        ? alpha(theme.palette.common.white, 0.04)
                                        : alpha(theme.palette.common.black, 0.04),
                            },
                        },
                        ...(Array.isArray(buttonProps?.sx)
                            ? buttonProps.sx
                            : buttonProps?.sx
                              ? [buttonProps.sx]
                              : []),
                    ]}>
                    {curIcon}
                    {typeof curLabel === 'string' ? <span>{curLabel}</span> : curLabel}
                </Button>
            </StyledTooltip>
        );
    }

    // Mobile
    return (
        <StyledTooltip
            title={mobileTooltip ?? curLabel ?? ''}
            placement={placement}
            open={mobileTooltipOpen}
            onOpen={() => onMobileTooltipOpenChange?.(true)}
            onClose={() => onMobileTooltipOpenChange?.(false)}>
            <IconButton
                onClick={handleClick}
                aria-pressed={selected}
                aria-label={
                    typeof curLabel === 'string' ? curLabel : selected ? ariaLabelOn : ariaLabelOff
                }
                sx={{
                    color: 'primary.main',
                    '&:hover': { color: 'text.primary' },
                }}
                {...iconButtonProps}>
                {curIcon}
            </IconButton>
        </StyledTooltip>
    );
}
