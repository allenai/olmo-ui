import { sva } from '@allenai/varnish-panda-runtime/css';
import type { RecipeVariantProps } from '@allenai/varnish-panda-runtime/types';

const datePickerRecipe = sva({
    slots: [
        'root',
        'label',
        'group',
        'input',
        'popover',
        'calendar',
        'dateInput',
        'button',
        'calendarHeader',
        'navButton',
        'dialog',
        'calendarGrid',
        'calendarCell',
    ],
    base: {
        root: {
            color: 'text.primary',
            _light: {
                color: 'text.primary.reversed',
            },
        },
        label: {
            color: 'text.primary',
            _light: {
                color: 'text.primary.reversed',
            },
        },
        group: {
            display: 'flex',
            width: '[fit-content]',
            alignItems: 'center',
            border: '1px solid',
            borderColor: 'gray.30',
            borderRadius: 'sm',
            padding: '1',
        },
        input: {
            padding: '[4px 2.5rem 4px 8px]',
        },
        calendar: {
            display: 'flex',
            flexDir: 'column',
            '& button': {
                height: '[fit-content]',
            },
            width: '[16rem]',
        },
        dateInput: {
            padding: '[0.25rem 2.5rem 0.25rem 0.5rem]',
            display: 'inline',
            width: '[fit-content]',
        },
        button: {
            border: '2px solid',
            borderColor: 'gray.100',
            borderRadius: 'sm',
            padding: '[0]',
            _light: {
                color: 'text.primary.reversed',
            },
        },
        calendarHeader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '[0 0.25rem 0.5rem]',
        },
        navButton: {
            width: '[2rem]',
            height: '[2rem]',
            padding: '0',
            backgroundColor: '[transparent]',
            border: '1px solid',
            borderColor: 'gray.60',
        },
        dialog: {},
        popover: {},
        calendarCell: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&[data-selected]': {
                background: 'accent.tertiary',
                border: '1px solid',
                borderColor: 'gray.30',
            },
        },
        calendarGrid: {
            width: '[100%]',
            borderCollapse: 'separate',
            borderSpacing: '1',
        },
    },
});

type DatePickerRecipeProps = RecipeVariantProps<typeof datePickerRecipe>;

export { datePickerRecipe, datePickerRecipe as default };
export type { DatePickerRecipeProps };
