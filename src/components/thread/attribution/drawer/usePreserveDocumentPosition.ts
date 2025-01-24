import { RefObject, useEffect, useRef } from 'react';

export const usePreserveDocumentPosition = (containerRef: RefObject<HTMLElement>) => {
    const preserveDocumentScrollPositionRef = useRef<{
        element: HTMLElement;
        distance: number;
    } | null>(null);

    const getScrollPreservationDetails = (target: HTMLElement) => {
        if (containerRef.current != null) {
            const targetBoundingRect = target.getBoundingClientRect();
            const containerBoundingRect = containerRef.current.getBoundingClientRect();
            const targetDistanceFromTopOfContainer =
                targetBoundingRect.top - containerBoundingRect.top;

            preserveDocumentScrollPositionRef.current = {
                element: target,
                distance: targetDistanceFromTopOfContainer,
            };
        }
    };

    useEffect(() => {
        const mutationObserver = new MutationObserver((mutations) => {
            if (
                mutations.some(
                    (mutation) => mutation.type === 'childList' && mutation.addedNodes.length > 0
                ) &&
                preserveDocumentScrollPositionRef.current != null &&
                containerRef.current != null
            ) {
                const { element, distance } = preserveDocumentScrollPositionRef.current;
                element.scrollIntoView();
                containerRef.current.scrollBy(0, -distance);
                preserveDocumentScrollPositionRef.current = null;
            }
        });

        if (containerRef.current != null) {
            mutationObserver.observe(containerRef.current, { subtree: true, childList: true });
        }

        return () => {
            mutationObserver.disconnect();
        };
    });

    return { getScrollPreservationDetails };
};
