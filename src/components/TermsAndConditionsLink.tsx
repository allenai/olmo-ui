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
        <Link target="__blank" href={link} color="inherit" underline="always">
            {children}
        </Link>
    );
};
