import { cx } from '@allenai/varnish-panda-runtime/css';
import { Button, Dialog, Label, Popover } from '@allenai/varnish-ui';
import {
    Calendar as AriaCalendar,
    CalendarCell as AriaCalendarCell,
    CalendarGrid as AriaCalendarGrid,
    CalendarGridBody as AriaCalendarGridBody,
    CalendarGridHeader as AriaCalendarGridHeader,
    CalendarHeaderCell as AriaCalendarHeaderCell,
    DateInput as AriaDateInput,
    DatePicker as AriaDatePicker,
    DateSegment as AriaDateSegment,
    DateValue,
    Group as AriaGroup,
    Heading as AriaHeading,
} from 'react-aria-components';

import datePickerRecipe, { DatePickerRecipeProps } from './datePicker.styles';

type DatePickerProps = {
    value?: DateValue;
    placeHolder?: DateValue;
    children?: React.ReactNode;
    className?: string;
    groupClassName?: string;
} & DatePickerRecipeProps;

const DatePicker = ({
    value,
    placeHolder,
    children,
    className,
    groupClassName,
    ...rest
}: DatePickerProps) => {
    const [variantProps, localProps] = datePickerRecipe.splitVariantProps(rest);
    const recipeClassNames = datePickerRecipe(variantProps);
    console.log(recipeClassNames.group);

    return (
        <AriaDatePicker
            value={value}
            placeholderValue={placeHolder}
            data-color-mode="dark"
            className={cx(recipeClassNames.root, className)}
            {...localProps}>
            <Label className={cx(recipeClassNames.label)}>Time available to all users</Label>
            <AriaGroup className={cx(recipeClassNames.group, groupClassName)}>
                <AriaDateInput className={cx(recipeClassNames.dateInput)}>
                    {(segment) => <AriaDateSegment segment={segment} />}
                </AriaDateInput>
                <Button className={cx(recipeClassNames.button)}>▼</Button>
            </AriaGroup>
            <Popover className={cx(recipeClassNames.popover)}>
                <Dialog className={cx(recipeClassNames.dialog)}>
                    <AriaCalendar className={cx(recipeClassNames.calendar)}>
                        <header className={cx(recipeClassNames.calendarHeader)}>
                            <Button
                                variant="contained"
                                size="small"
                                slot="previous"
                                className={cx(recipeClassNames.previous)}>
                                ◀
                            </Button>
                            <AriaHeading />
                            <Button
                                variant="contained"
                                size="small"
                                slot="next"
                                className={cx(recipeClassNames.next)}>
                                ▶
                            </Button>
                        </header>
                        <AriaCalendarGrid className={cx(recipeClassNames.calendarGrid)}>
                            <AriaCalendarGridHeader>
                                {(day) => <AriaCalendarHeaderCell>{day}</AriaCalendarHeaderCell>}
                            </AriaCalendarGridHeader>
                            <AriaCalendarGridBody>
                                {(date) => (
                                    <AriaCalendarCell
                                        date={date}
                                        className={cx(recipeClassNames.calendarCell)}
                                    />
                                )}
                            </AriaCalendarGridBody>
                        </AriaCalendarGrid>
                    </AriaCalendar>
                </Dialog>
            </Popover>
        </AriaDatePicker>
    );
};

export { DatePicker };
export type { DatePickerProps };
