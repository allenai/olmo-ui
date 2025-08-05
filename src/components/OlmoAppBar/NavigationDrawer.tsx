import { ArrowForwardIosOutlined, StickyNote2Outlined } from '@mui/icons-material';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ExploreIcon from '@mui/icons-material/ExploreOutlined';
import ScienceIcon from '@mui/icons-material/Science';
import SortIcon from '@mui/icons-material/Sort';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import { IconButton, Stack } from '@mui/material';
import { ComponentProps, type ReactNode } from 'react';
import { Helmet } from 'react-helmet';
import { UIMatch, useMatches } from 'react-router-dom';

import { useUserAuthInfo } from '@/api/auth/auth-loaders';
import { useAppContext } from '@/AppContext';
import { useFeatureToggles } from '@/FeatureToggleContext';
import { links } from '@/Links';
import { useCloseDrawerOnNavigation } from '@/utils/useClosingDrawerOnNavigation-utils';

import { ResponsiveDrawer } from '../ResponsiveDrawer';
import { HISTORY_DRAWER_ID } from '../thread/history/HistoryDrawer';
import { NavigationFooter } from './Footer/NavigationFooter';
import { HomeLink } from './HomeLink';
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
}: NavigationDrawerProps): ReactNode => {
    const matches = useMatches();
    const deepestMatch = matches[matches.length - 1];
    const toggleDrawer = useAppContext((state) => state.toggleDrawer);
    const userAuthInfo = useUserAuthInfo();

    const { isComparisonPageEnabled, isDatasetExplorerEnabled } = useFeatureToggles();
    const curriedDoesMatchPath = (...paths: string[]) => doesMatchPath(deepestMatch, ...paths);

    const hasPermission = (permission: string) =>
        userAuthInfo.userInfo?.permissions?.some((p) => p === permission) ?? false;

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
                        {isComparisonPageEnabled && hasPermission('read:internal-models') && (
                            <NavigationLink
                                icon={<ViewColumnIcon />}
                                selected={curriedDoesMatchPath(links.comparison)}
                                href={links.comparison}
                                DisclosureIcon={ScienceIcon}
                                experimental>
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
                        {hasPermission('write:model-config') && (
                            <NavigationLink
                                icon={<AdminPanelSettingsOutlinedIcon />}
                                selected={curriedDoesMatchPath(links.admin)}
                                href={links.admin}>
                                Admin
                            </NavigationLink>
                        )}
                    </Stack>
                    <NavigationFooter />
                </Stack>
            </ResponsiveDrawer>
        </>
    );
};

interface MobileHeadingProps {
    onClose?: () => void;
}

const MobileHeading = ({ onClose }: MobileHeadingProps): ReactNode => {
    return (
        <Stack direction="row" justifyContent="space-between" padding={3} alignItems="center">
            <HomeLink sx={{ transform: 'translateY(5px) ' }} />
            <IconButton
                onClick={onClose}
                sx={{ color: (theme) => theme.palette.text.drawer.primary, opacity: 0.5 }}
                aria-label="Close navigation drawer">
                <CloseIcon />
            </IconButton>
        </Stack>
    );
};

const DesktopHeading = (): ReactNode => {
    return <HomeLink height={65} sx={{ paddingInline: 3.5, paddingBlock: 4 }} />;
};
