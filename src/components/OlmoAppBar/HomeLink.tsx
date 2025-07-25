import { Link, type SxProps, type Theme } from '@mui/material';
import type { ReactNode } from 'react';

import { Ai2MarkLogoSVG } from '@/components/svg/Ai2MarkLogoSVG';
import { links } from '@/Links';

const HOME_LINK_TEST_ID = 'home-link';

interface HomeLinkProps {
    width?: number;
    height?: number;
    sx?: SxProps<Theme>;
    iconOnly?: boolean;
}

export const HomeLink = ({ width = 214, height, sx, iconOnly }: HomeLinkProps): ReactNode => {
    return (
        <Link data-testid={HOME_LINK_TEST_ID} href={links.home} sx={sx}>
            {iconOnly ? (
                <Ai2MarkLogoSVG title="Return to the Playground home page" width={30} />
            ) : (
                <img
                    src="/playground-logo.svg"
                    width={width}
                    height={height}
                    alt="Return to the Playground home page"
                    fetchPriority="high"
                />
            )}
        </Link>
    );
};
