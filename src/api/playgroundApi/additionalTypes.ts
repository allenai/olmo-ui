import type { SchemaResponseModel, SchemaRootModelResponse } from './playgroundApiSchema';

export type Model = Exclude<SchemaRootModelResponse, readonly SchemaResponseModel[]>[number];
