/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as useModels from '@/components/thread/ModelSelect/useModels';
import { server } from '@/mocks/node';
import { createMockModel } from '@/utils/test-utils';

import { ComparisonLoaderData, comparisonPageLoader } from './comparisonPageLoader';

describe('comparisonPageLoader: Model Selection Behaviors', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
        vi.stubEnv('IS_COMPARISON_PAGE_ENABLED', 'true');
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        server.resetHandlers();
    });

    const createTestId = () => `test-${Math.random()}`;

    const setupModelsApi = (models: ReturnType<typeof createMockModel>[]) => {
        server.use(
            http.get('http://localhost:8080/v4/models/', () => {
                return HttpResponse.json(models);
            })
        );
    };

    const loadComparisonPage = async () => {
        const loader = comparisonPageLoader(queryClient);
        return (await loader({
            params: {},
            request: new Request('http://localhost:8080/comparison'),
        })) as ComparisonLoaderData;
    };

    describe('New Model Selection Behaviors', () => {
        it('should use regular selection logic for first model', async () => {
            const testId = createTestId();
            const models = [
                createMockModel(`${testId}-model-1`, { accepts_files: false }),
                createMockModel(`${testId}-model-2`, { accepts_files: false }),
            ];
            setupModelsApi(models);

            const result = await loadComparisonPage();

            const comparisonModels = result.comparisonModels!;
            // First model should be first visible model
            expect(comparisonModels[0].model!.id).toBe(models[0].id);
        });

        it('should only consider models compatible with first default model for subsequent models', async () => {
            const testId = createTestId();
            const models = [
                createMockModel(`${testId}-file-model`, { accepts_files: true }),
                createMockModel(`${testId}-text-model-1`, { accepts_files: false }),
                createMockModel(`${testId}-text-model-2`, { accepts_files: false }),
            ];
            setupModelsApi(models);

            const result = await loadComparisonPage();

            const comparisonModels = result.comparisonModels!;
            const firstModel = comparisonModels[0].model!;
            const secondModel = comparisonModels[1].model!;

            // Both models should have the same file acceptance capability (be compatible)
            expect(firstModel.accepts_files).toBe(secondModel.accepts_files);
        });

        it('should filter for compatible models', async () => {
            const testId = createTestId();
            // Models with different file acceptance
            const models = [
                createMockModel(`${testId}-file-model`, { accepts_files: true }),
                createMockModel(`${testId}-text-model-1`, { accepts_files: false }),
                createMockModel(`${testId}-text-model-2`, { accepts_files: false }),
            ];
            setupModelsApi(models);

            const result = await loadComparisonPage();

            const comparisonModels = result.comparisonModels!;
            const firstModel = comparisonModels[0].model!;
            const secondModel = comparisonModels[1].model!;

            // Both models should be compatible
            expect(firstModel.accepts_files).toBe(secondModel.accepts_files);
        });

        it('should cycle through multiple compatible models', async () => {
            const testId = createTestId();
            // Create multiple models that are all compatible (same accepts_files value)
            const models = [
                createMockModel(`${testId}-text-model-1`, { accepts_files: false }),
                createMockModel(`${testId}-text-model-2`, { accepts_files: false }),
            ];
            setupModelsApi(models);

            const result = await loadComparisonPage();

            const comparisonModels = result.comparisonModels!;
            const firstModel = comparisonModels[0].model!;
            const secondModel = comparisonModels[1].model!;

            // Should use different models when multiple compatible models exist
            expect(firstModel.id).not.toBe(secondModel.id);
            expect(firstModel.accepts_files).toBe(secondModel.accepts_files);
        });

        it('should allow duplicate models when only one compatible model exists', async () => {
            const testId = createTestId();
            // Create only one model - both comparison slots should use it
            const singleModel = createMockModel(`${testId}-model`, { accepts_files: false });
            setupModelsApi([singleModel]);

            const result = await loadComparisonPage();

            const comparisonModels = result.comparisonModels!;
            const firstModel = comparisonModels[0].model!;
            const secondModel = comparisonModels[1].model!;

            // Both should be the same model
            expect(firstModel.id).toBe(singleModel.id);
            expect(secondModel.id).toBe(singleModel.id);
        });

        describe('when no models are compatible with first model', () => {
            let compatibilitySpy: any;

            beforeEach(() => {
                compatibilitySpy = vi
                    .spyOn(useModels, 'areModelsCompatibleForThread')
                    .mockReturnValue(false);
            });

            afterEach(() => {
                // Clean up the spy
                compatibilitySpy.mockRestore();
            });

            it('should handle when no models are compatible with first model', async () => {
                const testId = createTestId();

                // Create models where compatibility checking will fail
                const firstModel = createMockModel(`${testId}-first`, { accepts_files: true });
                const otherModels = [
                    createMockModel(`${testId}-model-1`, { accepts_files: false }),
                    createMockModel(`${testId}-model-2`, { accepts_files: false }),
                ];

                setupModelsApi([firstModel, ...otherModels]);

                const result = await loadComparisonPage();

                const comparisonModels = result.comparisonModels!;
                // Should still create comparison models with fallback behavior
                expect(comparisonModels[0].model).toBeDefined();
                expect(comparisonModels[1].model).toBeDefined();

                // The fallback behavior: when no compatible models found, use the first model
                expect(comparisonModels[1].model!.id).toBe(firstModel.id);
            });
        });
    });
});
