import { cx } from '@allenai/varnish-panda-runtime/css';
import { Button, Dialog, Label, Popover } from '@allenai/varnish-ui';
import {
    DateInput as AriaDateInput,
    DatePicker as AriaDatePicker,
    DateSegment as AriaDateSegment,
    DateValue,
    Group as AriaGroup,
} from 'react-aria-components';

import Calendar from './Calendar';
import datePickerRecipe, { DatePickerRecipeProps } from './datePicker.styles';

type DatePickerProps = {
    value?: DateValue;
    placeHolder?: DateValue;
    children?: React.ReactNode;
    className?: string;
    groupClassName?: string;
    labelText?: string;
} & DatePickerRecipeProps;

const DatePicker = ({
    value,
    placeHolder,
    children,
    className,
    groupClassName,
    labelText,
    ...rest
}: DatePickerProps) => {
    const [variantProps, localProps] = datePickerRecipe.splitVariantProps(rest);
    const recipeClassNames = datePickerRecipe(variantProps);

    return (
        <AriaDatePicker
            value={value}
            placeholderValue={placeHolder}
            data-color-mode="dark"
            className={cx(recipeClassNames.root, className)}
            {...localProps}>
            <Label className={cx(recipeClassNames.label)}>{labelText}</Label>
            <AriaGroup className={cx(recipeClassNames.group, groupClassName)}>
                <AriaDateInput className={cx(recipeClassNames.dateInput)}>
                    {(segment) => <AriaDateSegment segment={segment} />}
                </AriaDateInput>
                <Button className={cx(recipeClassNames.button)}>▼</Button>
            </AriaGroup>
            <Popover className={cx(recipeClassNames.popover)}>
                <Dialog className={cx(recipeClassNames.dialog)}>
                    <Calendar
                        classNames={{
                            calendar: recipeClassNames.calendar,
                            calendarHeader: recipeClassNames.calendarHeader,
                            navButton: recipeClassNames.navButton,
                            calendarGrid: recipeClassNames.calendarGrid,
                            calendarCell: recipeClassNames.calendarCell,
                        }}
                    />
                </Dialog>
            </Popover>
        </AriaDatePicker>
    );
};

export { DatePicker };
export type { DatePickerProps };
