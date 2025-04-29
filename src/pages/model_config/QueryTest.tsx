import type { ReactNode } from 'react';

import { $olmoApiQueryClient } from '@/api/olmo-api/olmo-api-client';

export const TestQueryFetch = (): ReactNode => {
    const { data: models } = $olmoApiQueryClient.useSuspenseQuery('get', '/v4/models/');

    return (
        <div>
            {models.map((model) => (
                <div key={model.id}>
                    <div>{model.id}</div>
                    <div>{model.host}</div>
                    <div>{model.internal}</div>
                </div>
            ))}
        </div>
    );
};
