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
        },
        dateInput: {
            padding: '[4px 2.5rem 4px 8px]',
            display: 'inline',
            width: '[fit-content]',
            background: '[black]',
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
        },
    },
});

type DatePickerRecipeProps = RecipeVariantProps<typeof datePickerRecipe>;

export { datePickerRecipe, datePickerRecipe as default };
export type { DatePickerRecipeProps };
