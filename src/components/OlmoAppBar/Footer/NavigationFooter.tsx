import FindInPageOutlined from '@mui/icons-material/FindInPageOutlined';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import { Stack } from '@mui/material';

import Ai2Icon from '@/components/assets/ai2.svg?react';
import DiscordIcon from '@/components/assets/discord.svg?react';
import { useDesktopOrUp } from '@/components/dolma/shared';
import { links } from '@/Links';

import { AvatarMenuLink } from '../AvatarMenuLink';
import { FooterLink } from '../FooterLink';
import { LoginLink } from '../LoginLink';

export const NavigationFooter = () => {
    const isDesktop = useDesktopOrUp();

    return (
        <Stack
            marginBlockStart="auto"
            id="nav-footer"
            gap={isDesktop ? 1 : 2}
            component={isDesktop ? 'ul' : 'div'}
            padding="0"
            marginBottom="0">
            <FooterLink
                startIcon={<Ai2Icon height={20} width={20} viewBox="0 0 72 72" />}
                href={links.ai2}
                endIcon={LaunchOutlinedIcon}>
                Ai2
            </FooterLink>
            <FooterLink
                startIcon={<DiscordIcon />}
                href={links.discord}
                endIcon={LaunchOutlinedIcon}>
                Discord
            </FooterLink>
            <FooterLink
                startIcon={<FindInPageOutlined />}
                href={links.documentation}
                endIcon={LaunchOutlinedIcon}>
                Documentation
            </FooterLink>

            {isDesktop && <LoginLink />}
            <AvatarMenuLink />
        </Stack>
    );
};
