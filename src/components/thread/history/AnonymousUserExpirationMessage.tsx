import { Link, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { useUserAuthInfo } from '@/api/auth/auth-loaders';
import { links } from '@/Links';

export const AnonymousUserExpirationMessage = (): ReactNode => {
    const { isAuthenticated } = useUserAuthInfo();
    const location = useLocation();

    if (isAuthenticated) {
        return null;
    }

    return (
        <Typography variant="caption" color="common.white" paddingInline={2} paddingBlockEnd={2}>
            Logged-in users get to keep their thread history forever.{' '}
            <Link
                href={links.login(location.pathname)}
                color={(theme) => theme.palette.secondary.light}>
                Log in
            </Link>{' '}
            now to save future threads.
        </Typography>
    );
};
