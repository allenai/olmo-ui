export const dateTimeFormat = 'M/D/YY h:mm a';

export const formatValueAsPercentage = (value: number, totalSum: number) => {
    return new Intl.NumberFormat(undefined, { style: 'percent', maximumFractionDigits: 0 }).format(
        value / totalSum
    );
};

export type NullishPartial<T> = { [P in keyof T]?: T[P] | null };

export type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};

/**
 * Get the model family name from a given model ID.
 * (for use when familyName is not set on the model)
 *
 * @param modelId - The ID of the model.
 * @returns The family name of the model or undefined of no match (e.g., 'Molmo', 'Qwen3', 'Tülu', or 'Olmo').
 */
export const getModelFamilyNameFromId = (modelId: string) => {
    const lowerCaseModelId = modelId.toLocaleLowerCase();

    if (lowerCaseModelId.includes('molmo') || lowerCaseModelId.includes('mm-olmo')) {
        return 'Molmo';
    }
    if (lowerCaseModelId.includes('olmo')) {
        return 'Olmo';
    }
    if (lowerCaseModelId.includes('qwen3')) {
        return 'Qwen3';
    }
    if (lowerCaseModelId.includes('tulu')) {
        return 'Tülu';
    }
};
