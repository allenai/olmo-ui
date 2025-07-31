import type { SvgIconComponent } from '@mui/icons-material';
import ArrowOutwardOutlined from '@mui/icons-material/ArrowOutwardOutlined';
import { Link } from '@mui/material';
import type { ReactNode } from 'react';

import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';

import { NavigationLink } from './NavigationLink';

interface FooterLinkProps {
    href: string;
    children: string;
    isExternal?: boolean;
    startIcon?: ReactNode;
    endIcon?: SvgIconComponent;
}

export const FooterLink = ({ href, children, isExternal, startIcon, endIcon }: FooterLinkProps) => {
    return (
        <>
            <Link
                href={href}
                target={isExternal ? '_blank' : '_self'}
                rel="noreferrer"
                fontWeight={600}
                sx={(theme) => ({
                    paddingInline: 4,
                    paddingBlock: 1,
                    [theme.breakpoints.down(DESKTOP_LAYOUT_BREAKPOINT)]: { display: 'none' },
                })}>
                {children} <ArrowOutwardOutlined sx={{ height: '1rem', width: '1rem' }} />
            </Link>
            <NavigationLink
                icon={startIcon}
                href={href}
                DisclosureIcon={endIcon}
                sx={(theme) => ({
                    [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: { display: 'none' },
                })}
                textSx={(theme) => ({
                    color: theme.palette.primary.main,
                })}>
                {children}
            </NavigationLink>
        </>
    );
};

export const MobileFooterLink = () => {};
