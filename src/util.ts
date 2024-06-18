export const dateTimeFormat = 'M/D/YY h:mm a';

// formattingUtils.ts
export const formatValueAsPercentage = (value: number, totalSum: number) => {
    const percentage = (value / totalSum) * 100;
    return `${percentage.toFixed(2)}%`;
};
