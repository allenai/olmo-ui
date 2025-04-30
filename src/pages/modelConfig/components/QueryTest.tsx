import { QueryErrorResetBoundary } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useSubmit } from 'react-router-dom';

import type { SchemaRootCreateModelConfigRequest } from '@/api/playgroundApi/playgroundApiSchema';

import { useGetAdminModels } from './useGetAdminModels';

export const ModelsList = (): ReactNode => {
    const models = useGetAdminModels();

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
    const { register, handleSubmit } = useForm<SchemaRootCreateModelConfigRequest>();
    const submit = useSubmit();

    const onSubmit = (data: SchemaRootCreateModelConfigRequest) => {
        const fullData: SchemaRootCreateModelConfigRequest = {
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
