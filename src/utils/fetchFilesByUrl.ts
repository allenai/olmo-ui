export function fetchFilesByUrls(urls: string[]) {
    const fetchPromises = urls.map(async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blob = await response.blob();
            const filename = url.substring(url.lastIndexOf('/') + 1) || 'downloaded_file';

            return new File([blob], filename, { type: blob.type });
        } catch (error) {
            console.error(`Error fetching ${url}:`, error);
            return null;
        }
    });

    return Promise.all(fetchPromises).then((files) =>
        files.filter((file): file is File => file !== null)
    );
}
