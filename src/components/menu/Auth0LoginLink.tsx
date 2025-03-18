import LoginIcon from '@mui/icons-material/LoginOutlined';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';

import { useUserAuthInfo } from '@/api/auth/auth-loaders';
import { links } from '@/Links';

import { AvatarMenuItem } from './AvatarMenuItem';

export const Auth0LoginLink = ({ themeModeAdaptive = true }: { themeModeAdaptive?: boolean }) => {
    const { isAuthenticated } = useUserAuthInfo();

    if (isAuthenticated) {
        return (
            <AvatarMenuItem
                icon={<LogoutIcon />}
                href={links.logout}
                themeModeAdaptive={themeModeAdaptive}>
                Log out
            </AvatarMenuItem>
        );
    }

    return (
        <AvatarMenuItem
            // eslint-disable-next-line react/jsx-no-undef
            icon={<LoginIcon />}
            href={links.login(window.location.href)}
            themeModeAdaptive={themeModeAdaptive}>
            Log in
        </AvatarMenuItem>
    );
};
