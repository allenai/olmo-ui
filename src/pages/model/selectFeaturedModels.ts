import { Model } from '@/api/playgroundApi/additionalTypes';

// featured should be in model config

const FEATURED_PREFIXES = ['molmo-2', 'olmo-3'];

export const selectFeaturedModels = (model: Model) =>
    !!FEATURED_PREFIXES.find(
        (prefix) => !model.internal && model.id.toLocaleLowerCase().startsWith(prefix)
    );
