export const dateTimeFormat = 'M/D/YY h:mm a';

export const formatValueAsPercentage = (value: number, totalSum: number) => {
    const percentage = (value / totalSum) * 100;
    return percentage.toFixed(0);
};
