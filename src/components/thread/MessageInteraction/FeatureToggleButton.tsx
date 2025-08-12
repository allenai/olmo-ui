/**
 * A responsive toggle button for enabling or disabling a feature, with
 * different UI/UX on desktop vs. mobile.
 *
 * **Desktop:** Renders a MUI `Button` wrapped in a `StyledTooltip` for
 *   optional hints.
 *
 *  **Mobile:** Renders an `IconButton` wrapped in a `StyledTooltip`.
 *
 * Common usage:
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
 */

import { alpha, Button, ButtonProps, IconButton, IconButtonProps } from '@mui/material';
import { ReactNode } from 'react';

import { useDesktopOrUp } from '@/components/dolma/shared';
import { StyledTooltip } from '@/components/StyledTooltip';

export interface FeatureToggleButtonProps {
    selected: boolean;
    onChange: (next: boolean) => void;

    // Labels/icons (strings and nodes are both supported)
    labelOn?: string;
    labelOff?: string;
    iconOn?: ReactNode;
    iconOff?: ReactNode;

    hint?: ReactNode; // shown on desktop as tooltip content
    mobileTooltip?: ReactNode; // shown on mobile
    mobileTooltipOpen?: boolean;
    onMobileTooltipOpenChange?: (open: boolean) => void;

    placement?: 'top' | 'bottom' | 'left' | 'right';
    showHint?: boolean; // whether to show the hint tooltip

    buttonProps?: Omit<ButtonProps, 'onClick'>;
    iconButtonProps?: Omit<IconButtonProps, 'onClick' | 'aria-pressed' | 'aria-label'>;

    ariaLabelOn?: string;
    ariaLabelOff?: string;

    // Analytics or side-effects
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
