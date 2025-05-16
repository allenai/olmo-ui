import { useEffect } from 'react';
import { type FieldValues, Path, type UseFormSetError } from 'react-hook-form';
import { useActionData } from 'react-router-dom';

import { error } from '@/api/error';

interface ConflictErrorPayload {
    code: number;
    message: string;
}

function isConflictErrorPayload(data: unknown): data is ConflictErrorPayload {
    if (typeof data !== 'object' || data === null) return false;

    const maybePayload = data as Record<string, unknown>;

    return maybePayload.code === 409 && typeof maybePayload.message === 'string';
}

export const useModelConfigValidationActionData = <TFieldValues extends FieldValues = FieldValues>(
    setError: UseFormSetError<TFieldValues>
) => {
    const actionData = useActionData();

    useEffect(() => {
        if (
            actionData != null &&
            typeof actionData === 'object' &&
            error.isValidationErrorPayload(actionData)
        ) {
            actionData.validation_errors.forEach((error) => {
                // Since the response models can be polymorphic Pydantic sometimes puts the type in the first loc element
                // Getting the last element gets us the right form field
                // This may not always be correct!
                const errorLoc = error.loc.at(-1);
                // @ts-expect-error - There's probably some mapping we need to do here to make this perfect
                setError(errorLoc, { type: error.type, message: error.msg });
            });
        }
        if (isConflictErrorPayload(actionData)) {
            setError('id' as Path<TFieldValues>, {
                type: 'conflict',
                message: actionData.message,
            });
        }
    }, [actionData, setError]);
};
