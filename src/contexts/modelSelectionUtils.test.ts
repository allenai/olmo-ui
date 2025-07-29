import { describe, expect, it } from 'vitest';

import type { Model } from '@/api/playgroundApi/additionalTypes';
import { createMockMessage, createMockModel } from '@/utils/test-utils';

import { selectModelIdForThread } from './modelSelectionUtils';

describe('selectModelIdForThread', () => {
    const mockModels: readonly Model[] = [
        createMockModel('model-1', { is_visible: true }),
        createMockModel('model-2', { is_visible: true }),
        createMockModel('model-3', { is_visible: false }),
        createMockModel('model-4', { is_visible: true }),
    ];

    describe('Thread continuity: maintaining conversation context', () => {
        it('continues with the same model from previous responses in thread', () => {
            const flatMessage = createMockMessage({ modelId: 'model-2' });

            const result = selectModelIdForThread(mockModels, flatMessage);

            expect(result).toBe('model-2');
        });

        it('maintains model choice even when URL specifies different model', () => {
            const flatMessage = createMockMessage({ modelId: 'model-2' });
            const modelParamFromURL = 'model-1';

            const result = selectModelIdForThread(mockModels, flatMessage, modelParamFromURL);

            expect(result).toBe('model-2');
        });

        it('falls back to URL model when thread model is no longer available', () => {
            const flatMessage = createMockMessage({ modelId: 'non-existent-model' });
            const modelParamFromURL = 'model-1';

            const result = selectModelIdForThread(mockModels, flatMessage, modelParamFromURL);

            expect(result).toBe('model-1');
        });

        it('falls back to URL model when thread model is undefined', () => {
            const flatMessage = createMockMessage({ modelId: undefined });
            const modelParamFromURL = 'model-1';

            const result = selectModelIdForThread(mockModels, flatMessage, modelParamFromURL);

            expect(result).toBe('model-1');
        });
    });

    describe('URL parameter: respecting model specification for new contexts', () => {
        it('uses URL model when starting new thread', () => {
            const modelParamFromURL = 'model-2';

            const result = selectModelIdForThread(mockModels, undefined, modelParamFromURL);

            expect(result).toBe('model-2');
        });

        it('falls back to system default when URL model unavailable', () => {
            const modelParamFromURL = 'non-existent-model';

            const result = selectModelIdForThread(mockModels, undefined, modelParamFromURL);

            expect(result).toBe('model-1'); // First visible model
        });

        it('falls back to system default when no URL model specified', () => {
            const result = selectModelIdForThread(mockModels, undefined, undefined);

            expect(result).toBe('model-1'); // First visible model
        });

        it('overrides URL parameter when thread has existing conversation', () => {
            const message = createMockMessage({ modelId: 'model-4' });
            const modelParamFromURL = 'model-1';

            const result = selectModelIdForThread(mockModels, message, modelParamFromURL);

            expect(result).toBe('model-4');
        });
    });

    describe('System reliability: ensuring app always works', () => {
        it('provides default model when no thread context or URL parameter', () => {
            const result = selectModelIdForThread(mockModels);

            expect(result).toBe('model-1'); // First visible model
        });

        it('selects first available model when others are hidden', () => {
            const modelsWithInvisibleFirst: readonly Model[] = [
                createMockModel('invisible-1', { is_visible: false }),
                createMockModel('invisible-2', { is_visible: false }),
                createMockModel('visible-1', { is_visible: true }),
                createMockModel('visible-2', { is_visible: true }),
            ];

            const result = selectModelIdForThread(modelsWithInvisibleFirst);

            expect(result).toBe('visible-1');
        });

        it('handles no available models gracefully', () => {
            const invisibleModels: readonly Model[] = [
                createMockModel('invisible-1', { is_visible: false }),
                createMockModel('invisible-2', { is_visible: false }),
            ];

            const result = selectModelIdForThread(invisibleModels);

            expect(result).toBeUndefined();
        });

        it('handles empty model list gracefully', () => {
            const result = selectModelIdForThread([]);

            expect(result).toBeUndefined();
        });

        it('handles empty model list with thread context gracefully', () => {
            const message = createMockMessage({ modelId: 'model-1' });

            const result = selectModelIdForThread([], message);

            expect(result).toBeUndefined();
        });

        it('handles empty model list with URL parameter gracefully', () => {
            const result = selectModelIdForThread([], undefined, 'model-1');

            expect(result).toBeUndefined();
        });

        it('handles corrupted thread data gracefully', () => {
            const malformedMessage = createMockMessage({ modelId: undefined });

            const result = selectModelIdForThread(mockModels, malformedMessage);

            expect(result).toBe('model-1'); // Falls back to first visible
        });

        it('handles missing thread response gracefully', () => {
            const result = selectModelIdForThread(mockModels, undefined);

            expect(result).toBe('model-1'); // Falls back to first visible
        });
    });
});
