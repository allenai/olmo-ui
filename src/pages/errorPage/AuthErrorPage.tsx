import { css } from '@allenai/varnish-panda-runtime/css';
import { LoginOutlined as LoginIcon } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';

import { useColorMode } from '@/components/ColorModeProvider';
import { links } from '@/Links';

import { ErrorPageWrapper } from './ErrorPageWrapper';

const errorBoxClassName = css({
    display: 'grid',
    gap: '5',
    paddingInline: '8',
    paddingBlock: '[48px]',
    border: '[1px solid]',
    borderColor: 'elements.faded.stroke',
    backgroundColor: 'elements.faded.fill',
    borderRadius: 'sm',
});

interface AuthErrorPageProps {
    title: string;
    message: string;
    redirectTo?: string;
}

export const AuthErrorPage = ({ title, message, redirectTo }: AuthErrorPageProps) => {
    const { colorMode } = useColorMode();
    const colorModeColor = colorMode === 'light' ? 'primary' : 'secondary';

    const loginRedirectUrl = redirectTo ?? window.location.href;

    return (
        <ErrorPageWrapper>
            <div className={errorBoxClassName}>
                <Typography variant="h3" component="h1">
                    {title}
                </Typography>
                {message}
                <p>
                    <Button
                        sx={{ paddingInline: 5 }}
                        endIcon={<LoginIcon />}
                        href={links.login(loginRedirectUrl)}
                        variant="contained"
                        color={colorModeColor}>
                        Log in
                    </Button>
                </p>
            </div>
        </ErrorPageWrapper>
    );
};
