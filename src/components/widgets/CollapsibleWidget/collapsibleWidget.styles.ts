import { sva } from '@allenai/varnish-panda-runtime/css';
import { type RecipeVariantProps } from '@allenai/varnish-panda-runtime/types';

const collapsibleWidgetRecipe = sva({
    slots: ['container', 'heading', 'panel', 'panelContent', 'footer'],
    base: {
        container: {
            // This was originally display: grid
            // flex with minHeight allows it to fit the container when we have overflow
            // better, if this causes problems with other collapsible implementations
            // this can change back to grid, and these styles can be made specific to thinking
            // or as a variant here.
            display: 'flex',
            flexDirection: 'column',
            minHeight: '[0]',
            backgroundColor: 'dark-teal.100', // dark only right now
            color: 'text',
            borderRadius: 'sm',
            overflow: 'hidden',
        },
        heading: {
            display: 'flex',
            backgroundColor: 'cream.4', // wrong name, right color
            paddingInline: '4',
            paddingBlock: '3',
            // contained1
        },
        panel: {
            display: 'flex',
            minHeight: '[0]',
            // Note: not cross-browser animation/transition
            // RAC uses `hidden` on the panel, which isn't animatible (in firefox)
            // This currently works on chrome
            // To do this on FF and Safari, we may need to do more custom stuff in the RAC component
            // or replace it...

            transitionBehavior: 'allow-discrete',
            // @ts-expect-error This is an experimental CSS prop, but panda doesn't know it
            interpolateSize: 'allow-keywords',
            overflowY: 'clip',
            transitionProperty: 'content-visibility, height',
            transitionTimingFunction: 'ease',
            transitionDuration: '150ms',
            height: 'auto',
            '&[hidden]': {
                height: '[0]',
            },
        },
        panelContent: {
            paddingInline: '4',
            paddingBlock: '3',
        },
    },
});

type CollapsibleWidgetRecipeVariantProps = RecipeVariantProps<typeof collapsibleWidgetRecipe>;

export { collapsibleWidgetRecipe };
export type { CollapsibleWidgetRecipeVariantProps };
