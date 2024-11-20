import {
    isCurrentDay,
    isPastWeek,
    pastMonthDateFormatter,
    pastWeekDateFormatter,
    todayDateFormatter,
} from '../utils/date-utils';

export const timeDisplay = (timeStamp: Date) => {
    if (isCurrentDay(timeStamp)) {
        return todayDateFormatter.format(timeStamp);
    } else if (isPastWeek(timeStamp)) {
        return pastWeekDateFormatter.format(timeStamp);
    }
    return pastMonthDateFormatter.format(timeStamp);
};
