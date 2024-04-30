import { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material';

interface TermsAndConditionsLinkProps {
    link: string;
}

export const TermAndConditionsLink = ({
    link,
    children,
}: TermsAndConditionsLinkProps & PropsWithChildren) => {
    return (
        <GrayLink target="__blank" to={link}>
            {children}
        </GrayLink>
    );
};

const GrayLink = styled(Link)`
    color: inherit;
    text-decoration: underline;
`;
