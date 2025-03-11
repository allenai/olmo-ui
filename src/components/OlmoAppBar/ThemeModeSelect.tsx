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
    styled,
} from '@mui/material';
import { ReactNode } from 'react';

import { analyticsClient } from '@/analytics/AnalyticsClient';

import { ColorPreference, useColorMode } from '../ColorModeProvider';

// We need the autoFocus prop from MenuItemProps so the MenuList can automatically focus the right item
// Including all the props just in case we need something else
interface ThemeModeSelectMenuItemProps extends MenuItemProps {
    title: string;
    mode: ColorPreference;
}

const ThemeModeSelectMenuItem = ({
    title,
    mode,
    onClick,
    ...menuItemProps
}: ThemeModeSelectMenuItemProps): ReactNode => {
    const [colorMode, setColorMode] = useColorMode();
    const isSelected = mode === colorMode;

    return (
        <MenuItem
            sx={(theme) => ({
                paddingInline: theme.spacing(1.5),
                background: 'transparent',
                [`&.${menuItemClasses.focusVisible}`]: {
                    backgroundColor: alpha(theme.palette.common.black, 0.12),
                },
                ':hover': {
                    backgroundColor: alpha(theme.palette.common.black, 0.04),
                },
                [`&.${menuItemClasses.selected}`]: {
                    background: alpha(theme.palette.background.paper, 0.6),
                    color: theme.palette.text.primary,
                    [`&.${menuItemClasses.focusVisible}`]: {
                        backgroundColor: alpha(theme.palette.common.black, 0.12),
                    },
                    ':hover': {
                        backgroundColor: alpha(theme.palette.common.black, 0.04),
                    },
                },
            })}
            {...menuItemProps}
            onClick={(e) => {
                analyticsClient.trackColorModeChange({ colorMode: mode });
                setColorMode(mode);
                onClick?.(e);
            }}>
            <Box flexGrow={1}>{title}</Box>
            {isSelected ? (
                <ListItemIcon
                    sx={{
                        flexDirection: 'row-reverse',
                        justifySelf: 'end',
                    }}>
                    <Check />
                </ListItemIcon>
            ) : null}
        </MenuItem>
    );
};

export const ThemeModeSelect = () => {
    // const [_, setAnchorEl] = useState<null | HTMLElement>(null);
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

    // const handleClose = () => {
    //     setAnchorEl(null);
    // };

    const handleMenuItemClick = () => {
        // handleClose();
    };

    return (
        <>
            <Select
                fullWidth
                size="small"
                onChange={handleMenuItemClick}
                input={<ThemeModeInput />}
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
                            backgroundColor: theme.palette.background.drawer.secondary,
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

const ThemeModeInput = styled((props: InputBaseProps) => <InputBase {...props} />)(({ theme }) => ({
    borderRadius: '8px',
    backgroundColor:
        theme.palette.mode === 'light'
            ? theme.palette.background.drawer.secondary
            : alpha(theme.palette.common.white, 0.1),
    backgroundImage: 'none',
    color: theme.palette.text.primary,
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
}));
