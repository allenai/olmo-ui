import { useEffect, useRef } from 'react';

// Taken from https://www.jacobparis.com/content/file-image-thumbnails
// This hook makes sure we don't leak memory when getting object URLs for files
export const useObjectUrls = () => {
    const mapRef = useRef<Map<File, string> | null>(null);

    useEffect(() => {
        const map = new Map<File, string>();
        mapRef.current = map;

        return () => {
            for (const [_file, url] of map) {
                URL.revokeObjectURL(url);
            }
            mapRef.current = null;
        };
    }, []);

    return function getObjectUrl(file: File) {
        const map = mapRef.current;
        if (!map) {
            throw Error('Cannot getObjectUrl while unmounted');
        }
        if (!map.has(file)) {
            const url = URL.createObjectURL(file);
            map.set(file, url);
        }
        const url = map.get(file);
        if (!url) {
            throw Error('Object url not found');
        }
        return url;
    };
};
