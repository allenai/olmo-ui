import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Stack } from '@mui/material';

import { ResponsiveDrawerProps, ResponsiveDrawer } from './ResponsiveDrawer';

export interface NavDrawerProps extends ResponsiveDrawerProps {
    onClose?: () => void;
}

export const NavDrawer = ({ children, onClose, ...props }: NavDrawerProps) => {
    return (
        <ResponsiveDrawer
            {...props}
            onClose={onClose}
            mobileHeading={
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    paddingBlock={3}
                    paddingInline={2}>
                    <img src="/olmo-logo-light.svg" alt="" height={46} width={91} />
                    <IconButton aria-label="Close navigation drawer" onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
            }
            desktopHeading={
                <Stack paddingInline={2} paddingBlock={4}>
                    <img src="/ai2-logo.png" alt="" height={33} width={292} />
                </Stack>
            }>
            {children}
        </ResponsiveDrawer>
    );
};
