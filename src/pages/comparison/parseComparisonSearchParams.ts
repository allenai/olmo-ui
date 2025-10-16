type ThreadParams = {
    threadId?: string;
    modelId?: string;
};
export const MIN_COMPARE_THREAD_COUNT = 2;
export const MAX_COMPARE_THREAD_COUNT = 3;

export function parseComparisonSearchParams(search: URLSearchParams) {
    const threadParamsList: ThreadParams[] = Array.from({
        length: MIN_COMPARE_THREAD_COUNT,
    }).map(() => ({}));
    search.forEach((value, key) => {
        // Expected key format is `paramType-position` (starts at 1), e.g. thread-1, model-2, template-1
        // This is to allow multiple threads/models/templates to be specified in the URL without
        // needing to rely on a specific order of parameters passed in the URL
        const [paramType, position] = key.split('-');
        const idx = position ? parseInt(position, 10) - 1 : -1;
        if (idx < 0 || idx > MAX_COMPARE_THREAD_COUNT - 1) {
            // Invalid position, ignore
            return;
        }

        // expand the list if needed (but only up to the max)
        while (threadParamsList.length <= idx) {
            threadParamsList.push({});
        }

        if (paramType === 'thread') {
            threadParamsList[idx].threadId = value;
        } else if (paramType === 'model') {
            threadParamsList[idx].modelId = value;
        }
    });

    return threadParamsList.slice(0, MAX_COMPARE_THREAD_COUNT);
}
