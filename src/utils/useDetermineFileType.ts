import { useEffect, useState } from 'react';

export const useDetermineMimeType = (url?: string) => {
    const [mimeType, setMimeType] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!url) {
            setMimeType(null);
            setLoading(false);
            setError(null);
            return;
        }

        const fetchMimeType = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(url, { method: 'GET' });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const contentType = response.headers.get('Content-Type');
                setMimeType(contentType);
            } catch (err) {
                setError((err as Error).message);
                setMimeType(null);
            } finally {
                setLoading(false);
            }
        };

        void fetchMimeType();
    }, [url]); // Re-run effect if URL changes

    return { mimeType, loading, error };
};
