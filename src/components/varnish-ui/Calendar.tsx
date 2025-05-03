import { cx } from '@allenai/varnish-panda-runtime/css';
import { Button } from '@allenai/varnish-ui';
import {
    Calendar as AriaCalendar,
    CalendarCell as AriaCalendarCell,
    CalendarGrid as AriaCalendarGrid,
    CalendarGridBody as AriaCalendarGridBody,
    CalendarGridHeader as AriaCalendarGridHeader,
    CalendarHeaderCell as AriaCalendarHeaderCell,
    Heading as AriaHeading,
} from 'react-aria-components';

type AriaCalendarComponentProps = {
    classNames: {
        calendar?: string;
        calendarHeader?: string;
        navButton?: string;
        calendarGrid?: string;
        calendarCell?: string;
    };
};

const Calendar = ({ classNames }: AriaCalendarComponentProps) => {
    return (
        <AriaCalendar className={cx(classNames.calendar)}>
            <header className={cx(classNames.calendarHeader)}>
                <Button
                    variant="contained"
                    size="small"
                    slot="previous"
                    className={cx(classNames.navButton)}>
                    ◀
                </Button>
                <AriaHeading />
                <Button
                    variant="contained"
                    size="small"
                    slot="next"
                    className={cx(classNames.navButton)}>
                    ▶
                </Button>
            </header>
            <AriaCalendarGrid className={cx(classNames.calendarGrid)}>
                <AriaCalendarGridHeader>
                    {(day) => <AriaCalendarHeaderCell>{day}</AriaCalendarHeaderCell>}
                </AriaCalendarGridHeader>
                <AriaCalendarGridBody>
                    {(date) => (
                        <AriaCalendarCell date={date} className={cx(classNames.calendarCell)} />
                    )}
                </AriaCalendarGridBody>
            </AriaCalendarGrid>
        </AriaCalendar>
    );
};

export default Calendar;
