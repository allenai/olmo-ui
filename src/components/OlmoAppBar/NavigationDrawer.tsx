import { ArrowForwardIosOutlined, StickyNote2Outlined } from '@mui/icons-material';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ExploreIcon from '@mui/icons-material/ExploreOutlined';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import SortIcon from '@mui/icons-material/Sort';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import { IconButton, Link, ListItem, Stack } from '@mui/material';
import { ComponentProps } from 'react';
import { Helmet } from 'react-helmet';
import { UIMatch, useMatches } from 'react-router-dom';

import { useUserAuthInfo } from '@/api/auth/auth-loaders';
import { useAppContext } from '@/AppContext';
import Ai2Icon from '@/components/assets/ai2.svg?react';
import DiscordIcon from '@/components/assets/discord.svg?react';
import { useFeatureToggles } from '@/FeatureToggleContext';
import { links } from '@/Links';
import { useCloseDrawerOnNavigation } from '@/utils/useClosingDrawerOnNavigation-utils';

import { useDesktopOrUp } from '../dolma/shared';
import { ResponsiveDrawer } from '../ResponsiveDrawer';
import { HISTORY_DRAWER_ID } from '../thread/history/HistoryDrawer';
import { AvatarMenuLink } from './AvatarMenuLink';
import { LoginLink } from './LoginLink';
import { NavigationLink } from './NavigationLink';
import { NewChatButton } from './NewChatButton';

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
    const isDesktop = useDesktopOrUp();
    const matches = useMatches();
    const deepestMatch = matches[matches.length - 1];
    const toggleDrawer = useAppContext((state) => state.toggleDrawer);
    const userAuthInfo = useUserAuthInfo();

    const { isComparisonPageEnabled, isDatasetExplorerEnabled } = useFeatureToggles();
    const curriedDoesMatchPath = (...paths: string[]) => doesMatchPath(deepestMatch, ...paths);

    useCloseDrawerOnNavigation({
        handleDrawerClose: onClose,
    });

    return (
        <>
            <Helmet>
                <link rel="preload" href="/playground-logo.svg" />
            </Helmet>
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
                        {isComparisonPageEnabled && (
                            <NavigationLink
                                icon={<ViewColumnIcon />}
                                selected={curriedDoesMatchPath(links.comparison)}
                                href={links.comparison}>
                                Compare models
                            </NavigationLink>
                        )}
                        <NavigationLink
                            icon={<StickyNote2Outlined />}
                            selected={curriedDoesMatchPath(links.faqs)}
                            href={links.faqs}
                            variant="footer">
                            FAQ
                        </NavigationLink>
                        {userAuthInfo.userInfo?.permissions?.some(
                            (permission) => permission === 'write:model-config'
                        ) && (
                            <NavigationLink
                                icon={<AdminPanelSettingsOutlinedIcon />}
                                selected={curriedDoesMatchPath(links.admin)}
                                href={links.admin}>
                                Admin
                            </NavigationLink>
                        )}
                    </Stack>
                    <Stack
                        marginBlockStart="auto"
                        id="nav-footer"
                        gap={1}
                        component="ul"
                        padding="0"
                        marginBottom="0">
                        {!isDesktop && (
                            <NavigationLink
                                icon={<Ai2Icon height={20} width={20} viewBox="0 0 72 72" />}
                                href={links.ai2}
                                DisclosureIcon={LaunchOutlinedIcon}
                                textSx={(theme) => ({
                                    color: theme.palette.primary.main,
                                })}>
                                allenai.org
                            </NavigationLink>
                        )}
                        {!isDesktop && (
                            <NavigationLink
                                icon={<DiscordIcon />}
                                href={links.discord}
                                DisclosureIcon={LaunchOutlinedIcon}
                                textSx={(theme) => ({
                                    color: theme.palette.primary.main,
                                })}>
                                Discord
                            </NavigationLink>
                        )}

                        <LoginLink />
                        <AvatarMenuLink />
                        {isDesktop && (
                            <ListItem
                                sx={{
                                    paddingInline: 4,
                                    paddingBlock: 2,
                                    gap: 3,
                                }}>
                                <Link
                                    href={links.ai2}
                                    target="_blank"
                                    rel="noreferer"
                                    fontWeight={600}>
                                    allenai.org
                                </Link>
                                <Link
                                    href={links.discord}
                                    target="_blank"
                                    rel="noreferer"
                                    fontWeight={600}>
                                    Discord
                                </Link>
                            </ListItem>
                        )}
                    </Stack>
                </Stack>
            </ResponsiveDrawer>
        </>
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
                <img
                    src="/playground-logo.svg"
                    width={214}
                    alt="Return to the Playground home page"
                    fetchPriority="high"
                />
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
            <img
                src="/playground-logo.svg"
                width={214}
                height={65}
                alt="Return to the Playground home page"
                fetchPriority="high"
            />
        </Link>
    );
};
