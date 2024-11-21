import {
    AddBoxOutlined,
    ArrowForwardIosOutlined,
    LoginOutlined as LoginIcon,
    RateReviewOutlined,
} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import ExploreIcon from '@mui/icons-material/ExploreOutlined';
import HelpCenterIcon from '@mui/icons-material/HelpCenterOutlined';
import LanguageIcon from '@mui/icons-material/Language';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import SortIcon from '@mui/icons-material/Sort';
import {
    alpha,
    IconButton,
    Link,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
} from '@mui/material';
import { ComponentProps } from 'react';
import { UIMatch, useMatches } from 'react-router-dom';

import { useUserAuthInfo } from '@/api/auth/auth-loaders';
import { useAppContext } from '@/AppContext';
import { useFeatureToggles } from '@/FeatureToggleContext';
import { links } from '@/Links';
import { useCloseDrawerOnNavigation } from '@/utils/useClosingDrawerOnNavigation-utils';

import { ResponsiveDrawer } from '../ResponsiveDrawer';
import { Tulu3LogoSVG } from '../svg/Tulu3LogoSVG';
import { HISTORY_DRAWER_ID } from '../thread/history/HistoryDrawer';
import { ColorModeSelection } from './ColorModeSelection';
import { NavigationLink } from './NavigationLink';

const Auth0LoginLink = () => {
    const { isAuthenticated } = useUserAuthInfo();

    if (isAuthenticated) {
        return (
            <NavigationLink icon={<LogoutIcon />} href={links.logout} variant="footer">
                Log out
            </NavigationLink>
        );
    }

    return (
        <NavigationLink
            icon={<LoginIcon />}
            href={links.login(window.location.href)}
            variant="footer">
            Log in
        </NavigationLink>
    );
};

const doesMatchPath = (match: UIMatch, ...paths: string[]) => {
    return paths.some((path) => {
        if (path.length === 1) {
            return match.pathname === path;
        }

        return match.pathname.startsWith(path);
    });
};

interface NavigationDrawerProps
    extends Omit<
        ComponentProps<typeof ResponsiveDrawer>,
        'children' | 'miniVariantCollapsedWidth' | 'miniVariantOpenedWidth'
    > {
    onClose: () => void;
    onDrawerToggle: () => void;
}

export const NavigationDrawer = ({
    onClose,
    onDrawerToggle,
    open,
    ...props
}: NavigationDrawerProps): JSX.Element => {
    const matches = useMatches();
    const deepestMatch = matches[matches.length - 1];
    const toggleDrawer = useAppContext((state) => state.toggleDrawer);

    const { isDatasetExplorerEnabled } = useFeatureToggles();

    const curriedDoesMatchPath = (...paths: string[]) => doesMatchPath(deepestMatch, ...paths);

    useCloseDrawerOnNavigation({
        handleDrawerClose: onClose,
    });

    return (
        <ResponsiveDrawer
            {...props}
            open={open}
            onClose={onClose}
            mobileHeading={<MobileHeading onClose={onClose} />}
            heading={<DesktopHeading />}
            desktopDrawerSx={{ gridArea: 'nav', width: (theme) => theme.spacing(40) }}>
            <Stack
                component="nav"
                sx={{
                    height: 1,
                    overflowX: 'hidden',
                    paddingBlockEnd: 2,
                }}>
                <Stack component="ul" padding="0" margin="0" gap={1}>
                    <NewChatButton />
                    <NavigationLink
                        onClick={() => {
                            toggleDrawer(HISTORY_DRAWER_ID);
                        }}
                        icon={<SortIcon />}
                        DisclosureIcon={ArrowForwardIosOutlined}>
                        Thread history
                    </NavigationLink>
                    {isDatasetExplorerEnabled && (
                        <NavigationLink
                            href={links.datasetExplorer}
                            icon={<ExploreIcon />}
                            selected={
                                curriedDoesMatchPath(links.datasetExplorer) ||
                                curriedDoesMatchPath(links.search) ||
                                curriedDoesMatchPath(links.document(''))
                            }>
                            Dataset Explorer
                        </NavigationLink>
                    )}
                    <NavigationLink
                        icon={<HelpCenterIcon />}
                        selected={curriedDoesMatchPath(links.faqs)}
                        href={links.faqs}
                        variant="footer">
                        FAQ
                    </NavigationLink>
                </Stack>
                <Stack
                    marginBlockStart="auto"
                    id="nav-footer"
                    gap={1}
                    component="ul"
                    padding="0"
                    marginBottom="0">
                    <NavigationLink
                        href={links.documentation}
                        icon={<LanguageIcon />}
                        selected={curriedDoesMatchPath(links.documentation)}
                        DisclosureIcon={LaunchOutlinedIcon}>
                        Documentation
                    </NavigationLink>
                    <NavigationLink
                        icon={<RateReviewOutlined />}
                        href={links.feedbackForm}
                        DisclosureIcon={LaunchOutlinedIcon}
                        variant="footer">
                        Give feedback
                    </NavigationLink>
                    <ColorModeSelection />
                    <Auth0LoginLink />
                    <ListItem
                        sx={(theme) => ({
                            paddingInline: 4,
                            color: theme.color['gray-50'].hex,
                            paddingBlock: 2,
                        })}>
                        <Typography
                            component="span"
                            variant="subtitle2"
                            fontWeight={400}
                            sx={(theme) => ({
                                color: alpha(theme.color['off-white'].hex, 0.5),
                            })}>
                            Proudly built by{' '}
                            <Link
                                href="https://allenai.org/"
                                target="_blank"
                                rel="noreferer"
                                fontWeight={600}>
                                Ai2
                            </Link>
                        </Typography>
                    </ListItem>
                </Stack>
            </Stack>
        </ResponsiveDrawer>
    );
};

interface MobileHeadingProps {
    onClose?: () => void;
}

const MobileHeading = ({ onClose }: MobileHeadingProps): JSX.Element => {
    return (
        <Stack direction="row" justifyContent="space-between" padding={3} alignItems="center">
            <Link
                href={links.home}
                sx={{
                    transform: 'translateY(5px)',
                }}>
                <Tulu3LogoSVG width={126} title="Return to the Playground home page" />
            </Link>
            <IconButton
                onClick={onClose}
                sx={{ color: (theme) => theme.palette.text.drawer.primary, opacity: 0.5 }}
                aria-label="Close navigation drawer">
                <CloseIcon />
            </IconButton>
        </Stack>
    );
};

const DesktopHeading = (): JSX.Element => {
    return (
        <Link paddingInline={3.5} paddingBlock={4} href={links.home}>
            <Tulu3LogoSVG title="Return to the Playground home page" width={126} />
        </Link>
    );
};

const NewChatButton = () => {
    return (
        <ListItem disablePadding dense>
            <ListItemButton
                alignItems="center"
                disableGutters
                href={links.playground}
                sx={(theme) => ({
                    minHeight: theme.spacing(5),
                    marginInline: theme.spacing(2),
                    marginBlockEnd: theme.spacing(1),
                    paddingBlock: theme.spacing(2),
                    paddingInline: theme.spacing(2),
                    gap: theme.spacing(2),
                    color: theme.color['off-white'].hex,
                    borderRadius: '9999px',
                    backgroundColor: alpha(theme.palette.common.white, 0.1),

                    ':hover, :hover > &': {
                        backgroundColor: alpha(theme.palette.common.white, 0.1),
                    },

                    '&.Mui-selected': {
                        backgroundColor: alpha(theme.palette.common.white, 0.1),
                        color: theme.palette.secondary.main,

                        ':hover': {
                            backgroundColor: alpha(theme.palette.common.white, 0.1),
                        },

                        ':focus-visible': {
                            backgroundColor: theme.palette.secondary.light,
                            color: theme.palette.secondary.contrastText,
                        },
                    },

                    '&.Mui-focusVisible': {
                        backgroundColor: theme.palette.secondary.light,
                        color: theme.palette.secondary.contrastText,
                    },
                })}>
                <ListItemIcon
                    sx={{
                        height: '1.25rem',
                        width: '1.25rem',
                        minWidth: 'unset',
                        '& svg': { fontSize: '1.25rem', transform: 'scale(1.2)' },
                    }}>
                    <AddBoxOutlined color="secondary" />
                </ListItemIcon>
                <ListItemText
                    sx={{ margin: 0, marginInlineEnd: 'auto' }}
                    primaryTypographyProps={{
                        variant: 'body1',
                        fontWeight: 500,
                        component: 'span',
                    }}>
                    New chat
                </ListItemText>
                <div />
            </ListItemButton>
        </ListItem>
    );
};
