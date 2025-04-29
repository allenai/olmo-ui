import { QueryErrorResetBoundary } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useSubmit } from 'react-router-dom';

import { $olmoApiQueryClient } from '@/api/olmo-api/olmoApiClient';
import type { SchemaCreateModelConfigRequest } from '@/api/olmo-api/v1';

export const ModelsList = (): ReactNode => {
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

// Taken from https://github.com/orgs/react-hook-form/discussions/9910#discussioncomment-9627947
export const QueryTestForm = (): ReactNode => {
    const { register, handleSubmit } = useForm<SchemaCreateModelConfigRequest>();
    const submit = useSubmit();

    const onSubmit = (data: SchemaCreateModelConfigRequest) => {
        const fullData: SchemaCreateModelConfigRequest = {
            ...data,
            host: 'modal',
            description: 'description',
            modelIdOnHost: 'foo',
            modelType: 'chat',
            name: data.id,
            promptType: 'text_only',
        };
        submit(fullData, { method: 'post' });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register('id')} />
            <button type="submit">Submit</button>
        </form>
    );
};

export const QueryTestPage = (): ReactNode => {
    return (
        <QueryErrorResetBoundary>
            {({ reset }) => (
                <ErrorBoundary onReset={reset} fallback={<div>Something went wrong</div>}>
                    <div>
                        <ModelsList />
                        <QueryTestForm />
                    </div>
                </ErrorBoundary>
            )}
        </QueryErrorResetBoundary>
    );
};
