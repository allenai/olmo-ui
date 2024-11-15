import { SvgIconComponent } from '@mui/icons-material';
import DarkModeFilledIcon from '@mui/icons-material/DarkMode';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeFilledIcon from '@mui/icons-material/LightMode';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import SystemFilledIcon from '@mui/icons-material/SettingsBrightness';
import SystemOutlinedIcon from '@mui/icons-material/SettingsBrightnessOutlined';
import { Button, ButtonGroup, ListItem } from '@mui/material';

import { useColorMode } from '../ColorModeProvider';

export const ColorModeSelection = () => {
    const [colorMode, setColorMode] = useColorMode();

    return (
        <ListItem disablePadding disableGutters dense>
            <ButtonGroup
                variant="outlined"
                sx={{
                    color: 'text.default',
                    marginInline: 4,
                }}>
                <ModeSelectionButton
                    // reverse color on select, and fill the button instead
                    onClick={() => {
                        setColorMode('system');
                    }}
                    SelectedIcon={SystemFilledIcon}
                    DefaultIcon={SystemOutlinedIcon}
                    selected={colorMode === 'system'}
                />
                <ModeSelectionButton
                    // reverse color on select, and fill the button instead
                    onClick={() => {
                        setColorMode('light');
                    }}
                    SelectedIcon={LightModeFilledIcon}
                    DefaultIcon={LightModeOutlinedIcon}
                    selected={colorMode === 'light'}
                />
                <ModeSelectionButton
                    // reverse color on select, and fill the button instead
                    onClick={() => {
                        setColorMode('dark');
                    }}
                    SelectedIcon={DarkModeFilledIcon}
                    DefaultIcon={DarkModeOutlinedIcon}
                    selected={colorMode === 'dark'}
                />
            </ButtonGroup>
        </ListItem>
    );
};

interface ModeSelectionButtonProps {
    DefaultIcon: SvgIconComponent;
    SelectedIcon: SvgIconComponent;
    selected: boolean;
    onClick: () => void;
}

const ModeSelectionButton = ({
    DefaultIcon,
    SelectedIcon,
    selected = false,
    onClick,
}: ModeSelectionButtonProps) => {
    return (
        <Button
            onClick={onClick}
            sx={(theme) => ({
                borderColor: theme.palette.text.reversed,
                color: theme.palette.text.reversed,
                '&:hover': {
                    color: theme.palette.text.reversed,
                    borderColor: theme.palette.text.reversed,
                },
            })}>
            {selected ? (
                <SelectedIcon sx={{ color: 'text.default' }} />
            ) : (
                <DefaultIcon sx={{ color: 'text.default' }} />
            )}
        </Button>
    );
};
