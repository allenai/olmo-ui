import type { Model } from '@/api/playgroundApi/additionalTypes';
import type { FlatMessage } from '@/api/playgroundApi/thread';
import { isModelVisible } from '@/components/thread/ModelSelect/useModels';

export function selectModelIdForThread(
    models: readonly Model[],
    lastResponse?: FlatMessage,
    modelParamFromURL?: string
): string | undefined {
    // First priority: use model from thread's last response if it exists
    let responseModelId: string | undefined;
    if (lastResponse) {
        responseModelId = lastResponse.modelId;
    }
    if (responseModelId && models.some((model) => model.id === responseModelId)) {
        return responseModelId;
    }

    // Second priority: use model from URL param if it exists (only when no thread context)
    if (modelParamFromURL && models.some((model) => model.id === modelParamFromURL)) {
        return modelParamFromURL;
    }

    // Fallback: first visible model (matches original selectedThreadPageLoader logic)
    const visibleModels = models.filter(isModelVisible);
    return visibleModels[0]?.id;
}
