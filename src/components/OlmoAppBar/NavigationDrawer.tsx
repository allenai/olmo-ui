import {
    LoginOutlined as LoginIcon,
    PolicyOutlined,
    RateReviewOutlined,
} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import ExploreIcon from '@mui/icons-material/ExploreOutlined';
import HelpCenterIcon from '@mui/icons-material/HelpCenterOutlined';
import LanguageIcon from '@mui/icons-material/Language';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import { IconButton, Link, Stack } from '@mui/material';
import { ComponentProps } from 'react';
import { UIMatch, useMatches } from 'react-router-dom';

import { useUserAuthInfo } from '@/api/auth/auth-loaders';
import { useAppContext } from '@/AppContext';
import { ChatIcon } from '@/components/assets/ChatIcon';
import { useFeatureToggles } from '@/FeatureToggleContext';
import { links } from '@/Links';
import { useCloseDrawerOnNavigation } from '@/utils/useClosingDrawerOnNavigation-utils';

import { Ai2LogoFull } from '../Ai2LogoFull';
import { ResponsiveDrawer } from '../ResponsiveDrawer';
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
    /*

grid-column width: 1fr -> 0 for better width
    
actual drawer:
    transition: 300ms width ease-in-out;
    overflow-x: hidden
    width: 0 -> 320px
inside drawer:
    width: 320px;
    position: absolute;
    right: 0;
    top: 0;
    left: auto;


same thing for right sidebar

*/
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
                <NavigationLink
                    href={links.playground}
                    icon={<ChatIcon />}
                    selected={curriedDoesMatchPath(links.playground, links.thread(''))}>
                    Playground
                </NavigationLink>
                <NavigationLink
                    onClick={() => {
                        toggleDrawer(HISTORY_DRAWER_ID);
                    }}
                    inset>
                    Thread history
                </NavigationLink>
                <NavigationLink
                    href={links.molmo}
                    selected={curriedDoesMatchPath(links.molmo)}
                    iconVariant="external">
                    Molmo
                </NavigationLink>
                <NavigationLink
                    href={links.ourModels}
                    selected={curriedDoesMatchPath(links.ourModels)}
                    iconVariant="external"
                    inset>
                    Ai2&apos;s models
                </NavigationLink>
                {isDatasetExplorerEnabled && (
                    <>
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
                        <NavigationLink
                            href={links.ourDatasets}
                            selected={curriedDoesMatchPath(links.ourDatasets)}
                            iconVariant="external"
                            inset>
                            Ai2&apos;s datasets
                        </NavigationLink>
                    </>
                )}
                <NavigationLink
                    href={links.documentation}
                    icon={<LanguageIcon />}
                    selected={curriedDoesMatchPath(links.documentation)}
                    iconVariant="external">
                    Documentation
                </NavigationLink>
                <Stack marginBlockStart="auto" id="nav-footer" gap={1}>
                    <NavigationLink
                        icon={<HelpCenterIcon />}
                        selected={curriedDoesMatchPath(links.faqs)}
                        href={links.faqs}
                        variant="footer">
                        FAQ
                    </NavigationLink>
                    <NavigationLink
                        icon={<RateReviewOutlined />}
                        href={links.feedbackForm}
                        iconVariant="external"
                        variant="footer">
                        Give feedback
                    </NavigationLink>
                    <NavigationLink
                        icon={<PolicyOutlined />}
                        href={links.responsibleUsePolicy}
                        iconVariant="external"
                        variant="footer">
                        Responsible use policy
                    </NavigationLink>
                    <ColorModeSelection />
                    <Auth0LoginLink />
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
        <Stack
            direction="row"
            justifyContent="space-between"
            paddingBlock={4}
            paddingInline={4}
            alignItems="center">
            <Link href={links.home}>
                <Ai2LogoFull width={97.3} height={30} alt="Return to the Playground home page" />
            </Link>
            <IconButton
                aria-label="Close navigation drawer"
                onClick={onClose}
                edge="end"
                sx={{ color: (theme) => theme.palette.secondary.main }}>
                <CloseIcon />
            </IconButton>
        </Stack>
    );
};

const DesktopHeading = (): JSX.Element => {
    return (
        <Link paddingInline={3.5} paddingBlock={4} href={links.home}>
            <Ai2LogoFull width={97.3} height={30} alt="Return to the Playground home page" />
        </Link>
    );
};
