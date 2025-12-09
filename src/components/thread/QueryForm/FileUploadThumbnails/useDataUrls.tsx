import { useCallback, useRef, useState } from 'react';

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export const useDataUrls = () => {
    const [urlMap, setUrlMap] = useState<Map<File, string>>(new Map());
    const pendingRef = useRef<Set<File>>(new Set());

    const getDataUrl = useCallback(
        (file: File | null): string | null => {
            if (!file) return null;

            if (urlMap.has(file)) {
                return urlMap.get(file) ?? null;
            }

            if (!pendingRef.current.has(file)) {
                pendingRef.current.add(file);
                void fileToDataUrl(file).then((dataUrl) => {
                    pendingRef.current.delete(file);
                    setUrlMap((prev) => new Map(prev).set(file, dataUrl));
                });
            }

            return null;
        },
        [urlMap]
    );

    return getDataUrl;
};
