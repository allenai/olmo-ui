import dayjs from 'dayjs';

export const todayDateFormatter = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: 'numeric',
});
export const pastWeekDateFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'short' });
export const pastMonthDateFormatter = new Intl.DateTimeFormat(undefined, {
    month: 'numeric',
    day: 'numeric',
    year: '2-digit',
});

export const isCurrentDay = (date: Date): boolean => {
    const dateClone = new Date(date);

    return dateClone.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
};

export const isPastWeek = (date: Date): boolean => {
    const differenceInDays = dayjs().diff(dayjs(date), 'day');

    return differenceInDays <= 7;
};

export const isOlderThan30Days = (createdDate: Date) => {
    const targetDate = dayjs(createdDate).add(29, 'days').format('YYYY-MM-DD');

    return dayjs().isAfter(targetDate, 'day');
};
