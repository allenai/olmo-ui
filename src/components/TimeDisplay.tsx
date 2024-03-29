import {
    isCurrentDay,
    isPastWeek,
    pastMonthDateFormatter,
    pastWeekDateFormatter,
    todayDateFormatter,
} from '../utils/date-utils';

interface TimeDisplayProps {
    timeStamp: Date;
}

export const TimeDisplay = ({ timeStamp }: TimeDisplayProps) => {
    if (isCurrentDay(timeStamp)) {
        return todayDateFormatter.format(timeStamp);
    } else if (isPastWeek(timeStamp)) {
        return pastWeekDateFormatter.format(timeStamp);
    }
    return pastMonthDateFormatter.format(timeStamp);
};
