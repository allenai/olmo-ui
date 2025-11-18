import { useEffect, useState } from 'react';
export function useElementSize(elementRef: React.RefObject<Element>) {
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                setSize({ width, height });
            }
        });

        resizeObserver.observe(element);

        // Cleanup
        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return size;
}
