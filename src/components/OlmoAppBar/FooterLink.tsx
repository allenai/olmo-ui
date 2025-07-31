import ArrowOutwardOutlined from '@mui/icons-material/ArrowOutwardOutlined';
import { Link } from '@mui/material';

interface FooterLinkProps {
    href: string;
    children: string;
    isExternal?: boolean;
}

export const FooterLink = ({ href, children, isExternal }: FooterLinkProps) => {
    return (
        <>
            <Link
                href={href}
                target={isExternal ? '_blank' : '_self'}
                rel="noreferrer"
                fontWeight={600}
                sx={{
                    paddingInline: 4,
                    paddingBlock: 1,
                }}>
                {children} <ArrowOutwardOutlined sx={{ height: '1rem', width: '1rem' }} />
            </Link>
        </>
    );
};

export const MobileFooterLink = () => {};
