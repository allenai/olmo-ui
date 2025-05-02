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
        'previous',
        'next',
        'dialog',
        'calendarGrid',
        'calendarCell',
    ],
    base: {
        root: {
            color: 'gray.60',
        },
        group: {
            display: 'flex',
            width: '[fit-content]',
            alignItems: 'center',
            border: '1px solid',
            borderColor: 'gray.100',
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
            width: '[250px]',
        },
        dateInput: {
            padding: '[4px 2.5rem 4px 8px]',
            display: 'inline',
            width: '[fit-content]',
        },
        button: {
            background: '[white]',
            color: 'extra-dark-teal.100',
            border: '2px solid',
            borderColor: 'gray.100',
            borderRadius: 'sm',
            padding: '[0]',
            boxSizing: '[content-box]',
        },
        calendarHeader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '[100%]',
            margin: '[0 4px .5rem]',
        },
        previous: {
            width: '[2rem]',
            height: '[2rem]',
            padding: '0',
            backgroundColor: '[transparent]',
            border: '1px solid',
            borderColor: 'gray.60',
        },
        next: {
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
            width:'[9]',
            height: '[9]',
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
