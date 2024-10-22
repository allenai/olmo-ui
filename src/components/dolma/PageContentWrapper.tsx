import { LinearProgress } from '@mui/material';
import { PropsWithChildren } from 'react';

import { BaseCard, NoPaddingContainer, useDesktopOrUp } from './shared';

interface PageContentWrapperProps extends PropsWithChildren {
    isLoading?: boolean;
}

export const PageContentWrapper = ({ isLoading, children }: PageContentWrapperProps) => {
    const Wrapper = useDesktopOrUp() ? BaseCard : NoPaddingContainer;
    return (
        <>
            <Wrapper>{children}</Wrapper>
            {isLoading && <LinearProgress sx={{ mt: 3 }} data-testid="search-progress-bar" />}
        </>
    );
};
