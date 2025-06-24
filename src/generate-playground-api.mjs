// eslint-disable-next-line import/order
import fs from 'node:fs';

import openapiTS, { astToString } from 'openapi-typescript';
import ts from 'typescript';

const DATE = ts.factory.createTypeReferenceNode(ts.factory.createIdentifier('Date')); // `Date`
const NULL = ts.factory.createLiteralTypeNode(ts.factory.createNull()); // `null`

const ast = await openapiTS(new URL('http://localhost:8000/openapi.json'), {
    defaultNonNullable: false,
    emptyObjectsUnknown: true,
    immutable: true,
    rootTypes: true,
    transform(schemaObject, _options) {
        if (schemaObject.format === 'date-time') {
            return schemaObject.nullable ? ts.factory.createUnionTypeNode([DATE, NULL]) : DATE;
        }
    },
});
const contents = astToString(ast);

fs.writeFileSync('./src/api/playgroundApi/playgroundApiSchema.d.ts', contents);
