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

import { css } from '@allenai/varnish-panda-runtime/css';
import { Button, ButtonProps, cx, IconButton, IconButtonProps } from '@allenai/varnish-ui';
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
    const ariaLabel =
        typeof curLabel === 'string' ? curLabel : selected ? ariaLabelOn : ariaLabelOff;
    const curIcon = selected ? iconOn : iconOff;
    const isDesktop = useDesktopOrUp();

    const { className: buttonClassName, ...restButtonProps } = buttonProps || {};
    const { className: iconButtonClassName, ...restIconButtonProps } = iconButtonProps || {};

    const handleClick = () => {
        const next = !selected;
        onChange(next);
        if (onTrack) {
            onTrack(next);
        }
    };

    if (isDesktop) {
        return (
            <StyledTooltip
                content={hint ?? ''}
                placement={placement}
                isOpen={showHint || undefined}
                delay={50}>
                <Button
                    className={cx(baseButtonClass, buttonClassName)}
                    variant="text"
                    color="primary"
                    onClick={handleClick}
                    aria-pressed={selected}
                    aria-label={ariaLabel}
                    startIcon={curIcon}
                    {...restButtonProps}>
                    {curLabel}
                </Button>
            </StyledTooltip>
        );
    }

    return (
        <StyledTooltip
            content={mobileTooltip ?? curLabel ?? ''}
            placement={placement}
            isOpen={mobileTooltipOpen}
            onOpenChange={(isOpen) => {
                return isOpen
                    ? onMobileTooltipOpenChange?.(isOpen)
                    : onMobileTooltipOpenChange?.(isOpen);
            }}>
            <IconButton
                className={cx(baseButtonClass, iconButtonClassName)}
                onClick={handleClick}
                aria-pressed={selected}
                aria-label={ariaLabel}
                color="primary"
                variant="text"
                {...restIconButtonProps}>
                {curIcon}
            </IconButton>
        </StyledTooltip>
    );
}

const baseButtonClass = css({
    paddingInline: '2',
    paddingBlock: '2',
});
