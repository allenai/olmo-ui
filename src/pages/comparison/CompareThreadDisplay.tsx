import { css } from '@allenai/varnish-panda-runtime/css';
import { styled, Tab, Tabs } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

import { isModelVisible, useModels } from '@/components/thread/ModelSelect/useModels';
import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';
import { useQueryContext } from '@/contexts/QueryContext';

import { SingleThreadContainer } from './SingleThreadContainer';
import { ComparisonTabPanel } from './tabView/ComparisonTabPanel';
import { dataViewId, viewIdAttr, viewPanelId, viewTabId } from './tabView/tabAttributes';

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

export const CompareThreadDisplay = () => {
    const models = useModels({
        // add back including model from state/params
        // || model.id === selectedModelIdFromState
        select: (data) => data.filter((model) => isModelVisible(model)),
    });

    const queryContext = useQueryContext();

    // Get the first threadViewId from context
    const [firstViewId] = queryContext.transform((threadViewId) => threadViewId);

    const [selectedThreadViewIdx, setSelectedThreadViewIdx] = useState(firstViewId);
    const threadContainerRef = useRef<HTMLDivElement>(null);

    const handleViewChange = (_e: React.SyntheticEvent, viewId: string) => {
        const threadView = threadContainerRef.current?.querySelector(dataViewId(viewId));
        threadView?.scrollIntoView({
            inline: 'center',
            behavior: 'smooth',
        });
        setSelectedThreadViewIdx(viewId);
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

                    if (viewId && viewId !== selectedThreadViewIdx) {
                        setSelectedThreadViewIdx(viewId);
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
    }, [selectedThreadViewIdx]);

    const tabs = queryContext.transform((threadViewId, model) => (
        <Tab
            key={threadViewId}
            label={model?.name}
            id={viewTabId(threadViewId)}
            aria-controls={viewPanelId(threadViewId)}
            value={threadViewId}
        />
    ));

    const containers = queryContext.transform((threadViewId, _model, threadId) => {
        const isSelected = threadViewId === selectedThreadViewIdx;
        return (
            <ComparisonTabPanel
                key={threadViewId}
                threadViewId={threadViewId}
                isSelected={isSelected}>
                <SingleThreadContainer
                    threadViewIdx={threadViewId}
                    threadRootId={threadId}
                    models={models}
                />
            </ComparisonTabPanel>
        );
    });

    return (
        <div className={containerStyle}>
            <MobileTabs value={selectedThreadViewIdx} onChange={handleViewChange}>
                {tabs}
            </MobileTabs>
            <div className={threadContainerClassNames} ref={threadContainerRef}>
                {containers}
            </div>
        </div>
    );
};

// I would prefer to use panda for this, but MUI's styles override it
const MobileTabs = styled(Tabs)(({ theme }) => ({
    paddingInline: theme.spacing(2),
    display: 'flex',
    [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
        display: 'none',
    },
}));
