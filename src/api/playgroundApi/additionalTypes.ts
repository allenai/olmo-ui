import type { SchemaModelResponse } from './playgroundApiSchema';

// NOTE: SchemaModelResponse is a readonly array type!!!
// It is NOT the same as Model[], because Model[] is mutable.
// You can use 'readonly Model[]' or 'ModelList' (defined below)
// or SchemaModelResponse where you need an array of models type.
export type Model = SchemaModelResponse[number];
export type ModelList = SchemaModelResponse;
