// I am just PRing what I already have. There is a lot of work to be done but here is the foundation. 
// Also my storybook story fails: TypeError: Failed to fetch dynamically imported module: http://localhost:6006/src/components/varnish-ui/DatePicker.stories.tsx?t=1745862183705


import { cx } from '@allenai/varnish-panda-runtime/css';
import { Button, Dialog, Input, Label, Popover } from '@allenai/varnish-ui';
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

import datePickerRecipe, { DatePickerRecipeProps } from '@/components/varnish-ui/datePicker.styles';

type DatePickerProps = {
    value?: DateValue;
    placeHolder?: DateValue;
    children?: React.ReactNode;
    className?: string;
} & DatePickerRecipeProps;

const DatePicker = ({ value, placeHolder, children, className, ...rest }: DatePickerProps) => {
    const [variantProps, localProps] = datePickerRecipe.splitVariantProps(rest);
    const recipeClassNames = datePickerRecipe(variantProps);

    return (
        <AriaDatePicker
            value={value}
            placeholderValue={placeHolder}
            data-color-mode="dark"
            className={cx(recipeClassNames.root, className)}>
            <Label>Time available to all users</Label>
            <AriaGroup className={cx(recipeClassNames.group, className)}>
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
