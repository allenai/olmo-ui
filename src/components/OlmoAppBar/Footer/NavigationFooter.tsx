import { Stack } from '@mui/material';

import { useDesktopOrUp } from '@/components/dolma/shared';
import { links } from '@/Links';

import { AvatarMenuLink } from '../AvatarMenuLink';
import { FooterLink } from '../FooterLink';
import { LoginLink } from '../LoginLink';

export const NavigationFooter = () => {
    const isDesktop = useDesktopOrUp();

    return (
        <Stack marginBlockStart="auto" id="nav-footer" gap={1} padding="0" marginBottom="0">
            <FooterLink href={links.ai2}>Ai2</FooterLink>
            <FooterLink href={links.discord}>Discord</FooterLink>
            <FooterLink href={links.documentation}>Documentation</FooterLink>
            {isDesktop && <LoginLink />}
            <AvatarMenuLink />
        </Stack>
    );
};
