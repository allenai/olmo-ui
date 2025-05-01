import { sva } from '@allenai/varnish-panda-runtime/css';
import type { RecipeVariantProps } from '@allenai/varnish-panda-runtime/types';

const datePickerRecipe = sva({
    slots: ['root', 'label', 'group', 'input', 'popover','calendar', 'dateInput'],
    base: {
        root: {
        },
        group: {
            display: 'flex !important',
            width: '[fit-content !important]',
            alignItems: 'center !important',
        },
        input: {
            padding: '[4px 2.5rem 4px 8px]',
        },
        calendar: {
            display: 'flex',
            flexDir: 'row',
            '& button': {
                height: '[fit-content]',
            }
        },
        dateInput: {
            padding: '[4px 2.5rem 4px 8px]',
        }
    },
});

type DatePickerRecipeProps = RecipeVariantProps<typeof datePickerRecipe>;

export { datePickerRecipe, datePickerRecipe as default };
export type { DatePickerRecipeProps };
