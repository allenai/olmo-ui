import { Link } from '@mui/material';
import { PropsWithChildren } from 'react';

interface TermsAndConditionsLinkProps {
    link: string;
}

export const TermAndConditionsLink = ({
    link,
    children,
}: TermsAndConditionsLinkProps & PropsWithChildren) => {
    return (
        <Link
            target="__blank"
            rel="noreferrer"
            href={link}
            color="inherit"
            sx={{ textDecoration: 'underline' }}>
            {children}
        </Link>
    );
};
