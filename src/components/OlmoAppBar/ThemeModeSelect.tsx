import { Check } from '@mui/icons-material';
import {
    alpha,
    Box,
    InputBase,
    inputBaseClasses,
    InputBaseProps,
    ListItemIcon,
    MenuItem,
    menuItemClasses,
    MenuItemProps,
    Select,
    selectClasses,
    SxProps,
    Theme,
} from '@mui/material';
import { ReactNode } from 'react';

import { analyticsClient } from '@/analytics/AnalyticsClient';

import { ColorPreference, useColorMode } from '../ColorModeProvider';

interface ThemeModeSelectMenuItemProps extends MenuItemProps {
    title: string;
    mode: ColorPreference;
    themeModeAdaptive?: boolean;
}

const ThemeModeSelectMenuItem = ({
    title,
    mode,
    themeModeAdaptive = true,
    onClick,
    ...menuItemProps
}: ThemeModeSelectMenuItemProps): ReactNode => {
    const [colorMode, setColorMode] = useColorMode();
    const isSelected = mode === colorMode;

    const sx: SxProps<Theme> = (theme) => ({
        '--theme-select-text-color': theme.palette.common.white,
        '--theme-select-background-color': alpha('#032629', 0.6),

        '&[data-theme-mode-adaptive="true"]': {
            '--theme-select-text-color': theme.palette.text.primary,
            '--theme-select-background-color': alpha(theme.palette.background.paper, 0.6),
        },

        color: 'var(--theme-select-text-color)',
        paddingInline: theme.spacing(1.5),

        [`&.${menuItemClasses.focusVisible}`]: {
            backgroundColor: alpha(theme.palette.common.black, 0.12),
        },
        ':hover': {
            backgroundColor: alpha(theme.palette.common.black, 0.04),
        },

        [`&.${menuItemClasses.selected}`]: {
            backgroundColor: 'var(--theme-select-background-color)',
            color: 'var(--theme-select-text-color)',
            [`&.${menuItemClasses.focusVisible}`]: {
                backgroundColor: alpha(theme.palette.common.black, 0.12),
            },
            ':hover': {
                backgroundColor: alpha(theme.palette.common.black, 0.04),
            },
        },
    });

    return (
        <MenuItem
            sx={sx}
            data-theme-mode-adaptive={themeModeAdaptive}
            {...menuItemProps}
            onClick={(e) => {
                analyticsClient.trackColorModeChange({ colorMode: mode });
                setColorMode(mode);
                onClick?.(e);
            }}>
            <Box flexGrow={1}>{title}</Box>
            {isSelected ? (
                <ListItemIcon
                    sx={(theme) => ({
                        flexDirection: 'row-reverse',
                        justifySelf: 'end',
                        color: themeModeAdaptive
                            ? theme.palette.primary.contrastText
                            : theme.palette.common.white,
                    })}>
                    <Check />
                </ListItemIcon>
            ) : null}
        </MenuItem>
    );
};

type ThemeModeInputProps = InputBaseProps & {
    themeModeAdaptive?: boolean;
};

export const ThemeModeSelect = ({ themeModeAdaptive = true }: { themeModeAdaptive?: boolean }) => {
    const [colorMode] = useColorMode();
    const themeOptions: Array<{
        title: string;
        mode: ColorPreference;
    }> = [
        {
            title: 'System theme',
            mode: 'system',
        },
        {
            title: 'Light',
            mode: 'light',
        },
        {
            title: 'Dark',
            mode: 'dark',
        },
    ];

    const selectedThemeMode = (
        themeOptions.find((option) => option.mode === colorMode) || themeOptions[0]
    ).mode;

    return (
        <>
            <Select
                fullWidth
                size="small"
                onChange={() => {}}
                input={<ThemeModeInput themeModeAdaptive={themeModeAdaptive} />}
                MenuProps={{
                    slotProps: {
                        paper: {
                            sx: (theme) => ({
                                background: 'transparent',
                                paddingInline: theme.spacing(1.5),
                                paddingBlock: '0',
                                boxShadow: 'none',
                                overflow: 'visible',
                            }),
                        },
                    },
                    MenuListProps: {
                        sx: (theme) => ({
                            borderRadius: theme.spacing(1),
                            backgroundColor: themeModeAdaptive
                                ? theme.palette.background.drawer.secondary
                                : theme.palette.background.drawer.primary,
                            overflow: 'hidden',
                            padding: 0,
                            boxShadow: 1,
                        }),
                    },
                }}
                value={selectedThemeMode}>
                {themeOptions.map((option) => (
                    <ThemeModeSelectMenuItem
                        key={option.mode}
                        value={option.mode}
                        title={option.title}
                        mode={option.mode}
                        themeModeAdaptive={themeModeAdaptive}>
                        {option.title}
                    </ThemeModeSelectMenuItem>
                ))}
            </Select>
        </>
    );
};

const ThemeModeInput = ({ themeModeAdaptive, ...props }: ThemeModeInputProps) => {
    const sx: SxProps<Theme> = (theme) => ({
        '--theme-select-text-color': theme.palette.common.white,
        '--theme-select-background-color': alpha(theme.palette.common.white, 0.1),

        '&[data-theme-mode-adaptive="true"]': {
            '--theme-select-text-color': theme.palette.text.primary,
            '--theme-select-background-color':
                theme.palette.mode === 'light'
                    ? theme.palette.background.drawer.secondary
                    : alpha(theme.palette.common.white, 0.1),
        },

        borderRadius: '8px',
        backgroundColor: 'var(--theme-select-background-color)',
        color: 'var(--theme-select-text-color)',
        minWidth: '14rem',
        marginBottom: theme.spacing(1),
        border: '1px solid rgba(0, 0, 0, 0.10)',
        '&.Mui-focused': {
            borderColor: theme.palette.secondary.main,
        },
        [`.${inputBaseClasses.input}`]: {
            paddingBlock: theme.spacing(1),
            paddingInlineStart: theme.spacing(3),
            paddingInlineEnd: theme.spacing(4),

            '&:focus': {
                backgroundColor: 'transparent',
            },
            [`&.${inputBaseClasses.input}`]: {
                paddingInlineEnd: theme.spacing(6),
            },
            [`.${inputBaseClasses.focused}`]: {
                borderColor: theme.palette.secondary.main,
            },
        },
        [`.${selectClasses.icon}`]: {
            marginInlineEnd: theme.spacing(1),
            transform: 'scale(1.2) translateY(0px)',
            fill: theme.palette.secondary.main,
        },
    });

    return <InputBase sx={sx} data-theme-mode-adaptive={themeModeAdaptive} {...props} />;
};
