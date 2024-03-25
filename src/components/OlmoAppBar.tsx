import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, IconButton, Stack, Toolbar } from '@mui/material';

export interface BannerProps {}

export const OlmoAppBar = ({}: BannerProps) => {
    return (
        <AppBar
            position="static"
            sx={{ backgroundColor: (theme) => theme.palette.background.paper }}>
            <Toolbar component={Stack} direction="row" justifyContent="space-between">
                <img src="/olmo-logo-light.svg" alt="" height={46} width={91} />
                <IconButton>
                    <MenuIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};
