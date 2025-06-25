import { css } from '@allenai/varnish-panda-runtime/css';
import { styled, Tab, Tabs } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

import { useAppContext } from '@/AppContext';
import { isModelVisible, useModels } from '@/components/thread/ModelSelect/useModels';
import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';

import { SingleThreadContainer } from './SingleThreadContainer';

const containerStyle = css({
    gridArea: 'content',
    minWidth: '[0]',
    minHeight: '[0]',
    height: '[100%]',
    gap: '4',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
});

const threadContainerClassNames = css({
    display: 'flex',
    height: '[100%]',

    overflow: {
        base: 'auto hidden',
        lg: 'hidden',
    },

    scrollSnapType: '[x mandatory]',
});

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

const viewIdAttr = 'data-view-id';
const viewPanelId = (id: string) => `comparison-tab-panel-${id}`;
const viewTabId = (id: string) => `comparison-tab-${id}`;
const dataViewId = (id: string) => `[${viewIdAttr}="${id}"]`;

export const CompareThreadDisplay = () => {
    const selectedCompareModels = useAppContext((state) => state.selectedCompareModels);
    const models = useModels({
        // add back including model from state/params
        // || model.id === selectedModelIdFromState
        select: (data) => data.filter((model) => isModelVisible(model)),
    });

    const firstViewId = selectedCompareModels?.[0]?.threadViewId ?? '0';
    const [selectedViewIdx, setSelectedViewIdx] = useState(firstViewId);
    const threadContainerRef = useRef<HTMLDivElement>(null);

    const handleViewChange = (_e: React.SyntheticEvent, viewId: string) => {
        const threadView = threadContainerRef.current?.querySelector(dataViewId(viewId));
        threadView?.scrollIntoView({
            inline: 'center',
            behavior: 'smooth',
        });
        setSelectedViewIdx(viewId);
    };

    useEffect(() => {
        let observer: IntersectionObserver | undefined;
        if (threadContainerRef.current) {
            observer = new IntersectionObserver(
                (entries) => {
                    const intersectingEntry = entries.find((entry) => {
                        return entry.isIntersecting;
                    });
                    const viewId = intersectingEntry?.target.getAttribute(viewIdAttr);

                    if (viewId && viewId !== selectedViewIdx) {
                        setSelectedViewIdx(viewId);
                    }
                },
                {
                    root: threadContainerRef.current,
                    rootMargin: '0px',
                    threshold: 1.0,
                }
            );
            threadContainerRef.current.querySelectorAll('[role="tabpanel"]').forEach((element) => {
                observer?.observe(element);
            });
        }
        return () => {
            observer?.disconnect();
        };
    }, [selectedViewIdx]);

    return (
        <div className={containerStyle}>
            <StyledTabs value={selectedViewIdx} onChange={handleViewChange}>
                {selectedCompareModels?.map(({ threadViewId, model }) => {
                    return (
                        <Tab
                            key={threadViewId}
                            label={model?.name}
                            id={viewTabId(threadViewId)}
                            aria-controls={viewPanelId(threadViewId)}
                            value={threadViewId}
                        />
                    );
                })}
            </StyledTabs>
            <div className={threadContainerClassNames} ref={threadContainerRef}>
                {selectedCompareModels?.map(({ threadViewId, rootThreadId }) => {
                    // remove non visible element from being accessible
                    // react 18 doesn't support this prop, so we have to do this:
                    const inertProp = {
                        inert: threadViewId !== selectedViewIdx ? '' : undefined,
                    };
                    return (
                        <div
                            key={threadViewId}
                            id={viewPanelId(threadViewId)}
                            role="tabpanel"
                            aria-labelledby={viewTabId(threadViewId)}
                            data-view-id={threadViewId}
                            className={singleThreadContainerClassNames}
                            {...inertProp}>
                            <SingleThreadContainer
                                threadViewIdx={threadViewId}
                                threadRootId={rootThreadId}
                                models={models}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// I would prefer to use panda for this, but MUI's styles override it
const StyledTabs = styled(Tabs)(({ theme }) => ({
    paddingInline: theme.spacing(2),
    display: 'flex',
    [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
        display: 'none',
    },
}));
