import { cx } from '@allenai/varnish-panda-runtime/css';
import { Button, Dialog, Label, Popover } from '@allenai/varnish-ui';
import {
    Calendar as AriaCalendar,
    CalendarCell as AriaCalendarCell,
    CalendarGrid as AriaCalendarGrid,
    DateInput as AriaDateInput,
    DatePicker as AriaDatePicker,
    DateSegment as AriaDateSegment,
    Group as AriaGroup,
    Heading as AriaHeading,
    DateValue,
} from 'react-aria-components';

import datePickerRecipe, { DatePickerRecipeProps } from './datePicker.styles';

type DatePickerProps = {
    value?: DateValue;
    placeHolder?: DateValue;
    children?: React.ReactNode;
    className?: string;
    groupClassName?: string;
} & DatePickerRecipeProps;

const DatePicker = ({ value, placeHolder, children, className, groupClassName, ...rest }: DatePickerProps) => {
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
            <Label>Time available to all users</Label>
            <AriaGroup className={cx(recipeClassNames.group, groupClassName)}>
                <AriaDateInput>{(segment) => <AriaDateSegment segment={segment} />}</AriaDateInput>
                <Button>▼</Button>
            </AriaGroup>
            <Popover className={cx(recipeClassNames.popover)} >
                <Dialog>
                    <AriaCalendar className={cx(recipeClassNames.calendar)}>
                        <header>
                            <Button
                                color="primary"
                                variant="contained"
                                size="small"
                                slot="previous">
                                ◀
                            </Button>
                            <AriaHeading />
                            <Button color="primary" variant="contained" size="small" slot="next">
                                ▶
                            </Button>
                        </header>
                        <AriaCalendarGrid>
                            {(date) => <AriaCalendarCell date={date} />}
                        </AriaCalendarGrid>
                    </AriaCalendar>
                </Dialog>
            </Popover>
        </AriaDatePicker>
    );
};

export { DatePicker };
export type { DatePickerProps };
