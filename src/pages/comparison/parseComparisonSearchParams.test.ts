import { describe, expect, it } from 'vitest';

import { parseComparisonSearchParams } from './parseComparisonSearchParams';

const minCount = 2;
const maxCount = 4;

describe('parseCompareSearchParams', () => {
    it('should render default list with min count when no params', () => {
        const searchParams = new URLSearchParams();

        const result = parseComparisonSearchParams(searchParams, minCount, maxCount);
        expect(result.length).toEqual(minCount);
    });

    it('should parse thread and model params correctly', () => {
        const searchParams = new URLSearchParams();
        searchParams.append('thread-1', 'thread1-id');
        searchParams.append('model-1', 'model1-id');
        searchParams.append('thread-2', 'thread2-id');
        searchParams.append('model-2', 'model2-id');

        const result = parseComparisonSearchParams(searchParams, minCount, maxCount);
        expect(result.length).toEqual(minCount);
        expect(result).toEqual([
            { threadId: 'thread1-id', modelId: 'model1-id' },
            { threadId: 'thread2-id', modelId: 'model2-id' },
        ]);
    });

    it('should ignore improperly formatted thread and model params', () => {
        const searchParams = new URLSearchParams();
        searchParams.append('thread1', 'thread1-id');
        searchParams.append('model--1', 'model1-id');
        searchParams.append('thread2-2', 'thread2-id');
        searchParams.append('llm-1', 'llm1-id');
        searchParams.append('template', 'template-id');

        const result = parseComparisonSearchParams(searchParams, minCount, maxCount);
        expect(result.length).toEqual(minCount);
        expect(result).toEqual([{}, {}]);
    });

    it('should ignore positions out of bounds gracefully', () => {
        const searchParams = new URLSearchParams();
        searchParams.append('thread-1', 'thread1-id');
        searchParams.append('model-1', 'model1-id');
        searchParams.append('thread-2', 'thread2-id');
        searchParams.append('model-2', 'model2-id');
        searchParams.append(`thread-${maxCount + 1}`, `thread${maxCount + 1}-id`);
        searchParams.append(`model-${minCount - 1}`, `model${minCount - 1}-id`);

        const result = parseComparisonSearchParams(searchParams, minCount, maxCount);
        expect(result.length).toBeLessThanOrEqual(maxCount);
        expect(result.length).toBeGreaterThanOrEqual(minCount);
        expect(result).toEqual([
            { threadId: 'thread1-id', modelId: 'model1-id' },
            { threadId: 'thread2-id', modelId: 'model2-id' },
        ]);
    });

    it('should expand the list by one position when one is added', () => {
        const searchParams = new URLSearchParams();
        searchParams.append('thread-1', 'thread1-id');
        searchParams.append('model-1', 'model1-id');
        searchParams.append('thread-2', 'thread2-id');
        searchParams.append('model-2', 'model2-id');
        searchParams.append('thread-3', 'thread3-id');
        searchParams.append('model-3', 'model3-id');

        const result = parseComparisonSearchParams(searchParams, minCount, maxCount);
        expect(result).toEqual([
            { threadId: 'thread1-id', modelId: 'model1-id' },
            { threadId: 'thread2-id', modelId: 'model2-id' },
            { threadId: 'thread3-id', modelId: 'model3-id' },
        ]);
    });

    it('should expand the list up to max count if higher positions provided', () => {
        const searchParams = new URLSearchParams();
        searchParams.append('thread-1', 'thread1-id');
        searchParams.append('model-1', 'model1-id');
        searchParams.append('thread-2', 'thread2-id');
        searchParams.append('model-2', 'model2-id');
        searchParams.append('thread-3', 'thread3-id');
        searchParams.append('model-3', 'model3-id');
        searchParams.append('thread-4', 'thread4-id');
        searchParams.append('model-4', 'model4-id');
        searchParams.append('thread-5', 'thread5-id');
        searchParams.append('model-5', 'model5-id');

        const result = parseComparisonSearchParams(searchParams, minCount, maxCount);
        expect(result.length).toEqual(maxCount);
        expect(result).toEqual([
            { threadId: 'thread1-id', modelId: 'model1-id' },
            { threadId: 'thread2-id', modelId: 'model2-id' },
            { threadId: 'thread3-id', modelId: 'model3-id' },
            { threadId: 'thread4-id', modelId: 'model4-id' },
        ]);
    });
});
