import type { SchemaResponseModel, SchemaRootModelResponse } from './playgroundApiSchema';

// This excludes the admin models from the model response type
// This is useful when we're hitting the models endpoint without the ?admin=true param
export type Model = Exclude<SchemaRootModelResponse, readonly SchemaResponseModel[]>[number];
