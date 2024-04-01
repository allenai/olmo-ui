export const todayDateFormatter = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: 'numeric',
});
export const pastWeekDateFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'long' });
export const pastMonthDateFormatter = new Intl.DateTimeFormat(undefined, {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
});

export const isCurrentDay = (date: Date): boolean => {
    const dateClone = new Date(date);

    return dateClone.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
};

export const isPastWeek = (date: Date): boolean => {
    return new Date().getDate() - date.getDate() > 7 && new Date().getDate() - date.getDate() <= 30;
};
