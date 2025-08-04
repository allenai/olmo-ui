import { css } from '@allenai/varnish-panda-runtime/css';
import { PropsWithChildren } from 'react';

import { useDesktopOrUp } from '@/components/dolma/shared';

import { viewPanelId, viewTabId } from './tabAttributes';

const singleThreadContainerClassNames = css({
    display: 'flex',
    flexDirection: 'column',
    width: '[100%]',
    flexShrink: {
        base: '0',
        lg: '1',
    },
    scrollSnapAlign: 'center',
});

interface ComparsonTabPanelProps extends PropsWithChildren {
    threadViewId: string;
    isSelected: boolean;
}

export const ComparisonTabPanel = ({
    threadViewId,
    isSelected,
    children,
}: ComparsonTabPanelProps) => {
    const isDesktop = useDesktopOrUp();
    const mobileAndNotSelected = !isDesktop && !isSelected;
    // react 18 doesn't define the inert prop on HTML elements
    const inertProp = { inert: mobileAndNotSelected ? '' : undefined };
    return (
        <div
            key={threadViewId}
            id={viewPanelId(threadViewId)}
            role="tabpanel"
            aria-labelledby={viewTabId(threadViewId)}
            data-view-id={threadViewId}
            className={singleThreadContainerClassNames}
            {...inertProp}>
            {children}
        </div>
    );
};
