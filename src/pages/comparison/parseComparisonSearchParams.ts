type ThreadParams = {
    threadId?: string;
    modelId?: string;
};
export const MIN_COMPARE_THREAD_COUNT = 2;
export const MAX_COMPARE_THREAD_COUNT = 3;

export function parseComparisonSearchParams(
    search: URLSearchParams,
    minCount = MIN_COMPARE_THREAD_COUNT,
    maxCount = MAX_COMPARE_THREAD_COUNT
): ThreadParams[] {
    const threadParamsList: ThreadParams[] = Array.from({
        length: minCount,
    }).map(() => ({}));

    search.forEach((value, key) => {
        // Legacy support for comma-separated thread/model lists
        if (key === 'threads' || key === 'models') {
            const values = value.split(',');
            values.forEach((v, idx) => {
                if (key === 'threads') {
                    threadParamsList[idx] = {
                        ...threadParamsList[idx],
                        threadId: v,
                    };
                } else {
                    threadParamsList[idx] = {
                        ...threadParamsList[idx],
                        modelId: v,
                    };
                }
            });
            return;
        }

        // Expected key format is `paramType-position` (starts at 1), e.g. thread-1=, model-2=, template-1=
        // This is to allow multiple threads/models/templates to be specified in the URL without
        // needing to rely on a specific order of parameters passed in the URL
        const [paramType, position] = key.split('-');
        const positionNumber = Number(position);

        // if not an integer, set to invalid index (filters out NaN, undefined, Infinity, floats)
        const idx = Number.isInteger(positionNumber) ? positionNumber - 1 : -1;
        if (idx < 0 || idx > maxCount - 1) {
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

    return threadParamsList.slice(0, maxCount);
}
