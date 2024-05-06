import { IconButton, Drawer as MuiDrawer, styled } from '@mui/material';
import { PropsWithChildren, ReactNode, useState } from 'react';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        gridArea: 'nav',

        '& .MuiPaper-root': { position: 'static' },

        overflowX: 'hidden',
        // This is slightly larger than the rough width of the drawer when it's expanded
        // If the text gets longer and things start getting cut off you'll want to bump this up
        maxWidth: `var(--navigation-drawer-max-width, ${theme.spacing(45)})`,

        transition: theme.transitions.create('max-width', {
            easing: theme.transitions.easing.sharp,
            duration: `var(--navigation-drawer-max-width-transition-duration, ${theme.transitions.duration.enteringScreen}ms)`,
        }),

        ...(!open && {
            // This is a number I thought looked good to have just the icons showing.
            // If the icons get bigger or the padding around them changes, this will need to change
            '--navigation-drawer-max-width': theme.spacing(7),
            '--navigation-drawer-max-width-transition-duration': `${theme.transitions.duration.leavingScreen}ms`,
        }),
    })
);

interface NavigationMiniDrawerProps extends PropsWithChildren {
    Heading: ReactNode;
}

export const NavigationMiniDrawer = ({ children, Heading }: NavigationMiniDrawerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleIsOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Drawer variant="permanent" open={isOpen}>
            <DrawerHeader>
                {Heading}
                <IconButton onClick={toggleIsOpen}>
                    {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </DrawerHeader>
            {children}
        </Drawer>
    );
};
