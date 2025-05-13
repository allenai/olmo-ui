import { useEffect } from 'react';
import { type FieldValues, type UseFormSetError } from 'react-hook-form';
import { useActionData } from 'react-router-dom';

import { error } from '@/api/error';

export const usePydanticValidationActionData = <TFieldValues extends FieldValues = FieldValues>(
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
    }, [actionData, setError]);
};
