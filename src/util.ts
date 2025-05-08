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
