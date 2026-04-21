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
    PaletteMode,
    Select,
    selectClasses,
    SxProps,
    Theme,
    useColorScheme,
} from '@mui/material';
import { ReactNode } from 'react';

import { analyticsClient } from '@/analytics/AnalyticsClient';

interface ThemeModeSelectMenuItemProps extends MenuItemProps {
    title: string;
    mode: 'light' | 'dark' | 'system';
}

const ThemeModeSelectMenuItem = ({
    title,
    mode,
    onClick,
    ...menuItemProps
}: ThemeModeSelectMenuItemProps): ReactNode => {
    const { mode: muiMode, setMode } = useColorScheme();
    const isSelected = mode === muiMode;

    const sx: SxProps<Theme> = (theme) => ({
        '--theme-select-text-color': theme.vars.palette.text.primary,
        '--theme-select-background-color': `rgba(${theme.vars.palette.background.paperChannel} / 0.6)`,

        '&[data-color-scheme="dark"]': {
            '--theme-select-text-color': theme.palette.common.white,
            '--theme-select-background-color': alpha('#032629', 0.6),
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
            {...menuItemProps}
            onClick={(e) => {
                analyticsClient.trackColorModeChange({ colorMode: mode });
                setMode(mode);
                onClick?.(e);
            }}>
            <Box flexGrow={1}>{title}</Box>
            {isSelected ? (
                <ListItemIcon
                    sx={(theme) => ({
                        flexDirection: 'row-reverse',
                        justifySelf: 'end',
                        color: theme.vars.palette.primary.contrastText,
                    })}>
                    <Check />
                </ListItemIcon>
            ) : null}
        </MenuItem>
    );
};

export const ThemeModeSelect = ({ colorScheme }: { colorScheme?: PaletteMode }) => {
    const { mode } = useColorScheme();
    const themeOptions: Array<{
        title: string;
        mode: 'light' | 'dark' | 'system';
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
        themeOptions.find((option) => option.mode === mode) || themeOptions[0]
    ).mode;

    return (
        <>
            <Select
                fullWidth
                size="small"
                onChange={() => {}}
                input={<ThemeModeInput />}
                MenuProps={{
                    slotProps: {
                        paper: {
                            // @ts-expect-error setting a data attr on paper
                            'data-color-scheme': colorScheme,
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
                            backgroundColor: theme.vars.palette.background.drawer.secondary,
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
                        mode={option.mode}>
                        {option.title}
                    </ThemeModeSelectMenuItem>
                ))}
            </Select>
        </>
    );
};

const ThemeModeInput = (props: InputBaseProps) => {
    const sx: SxProps<Theme> = (theme) => ({
        '--theme-select-text-color': theme.vars.palette.text.primary,
        '--theme-select-background-color': alpha(theme.palette.common.white, 0.1),

        '[data-color-scheme="dark"]': {
            '--theme-select-text-color': theme.palette.common.white,
        },

        borderRadius: '8px',
        backgroundColor: 'var(--theme-select-background-color)',
        color: 'var(--theme-select-text-color)',
        minWidth: '14rem',
        marginBottom: theme.spacing(1),
        border: '1px solid rgba(0, 0, 0, 0.10)',
        '&.Mui-focused': {
            borderColor: theme.vars.palette.secondary.main,
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
                borderColor: theme.vars.palette.secondary.main,
            },
        },
        [`.${selectClasses.icon}`]: {
            marginInlineEnd: theme.spacing(1),
            transform: 'scale(1.2) translateY(0px)',
            fill: theme.vars.palette.secondary.main,
        },
    });

    return <InputBase sx={sx} {...props} />;
};
