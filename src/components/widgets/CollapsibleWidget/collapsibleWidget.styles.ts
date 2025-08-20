import { sva } from '@allenai/varnish-panda-runtime/css';
import { type RecipeVariantProps } from '@allenai/varnish-panda-runtime/types';

const collapsibleWidgetRecipe = sva({
    slots: ['container', 'heading', 'panel', 'panelContent', 'footer', 'trigger'],
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
            '--padding-block': 'spacing.3',
            '--padding-inline': 'spacing.4',
        },
        heading: {
            display: 'flex',
            backgroundColor: 'cream.4', // wrong name, right color
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
            paddingInline: 'var(--padding-inline)',
            paddingBlock: 'var(--padding-block)',
        },
        trigger: {
            display: 'flex',
            flexGrow: '1',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '3',
            paddingInline: 'var(--padding-inline)',
            paddingBlock: 'var(--padding-block)',

            cursor: 'pointer',

            '&[data-focus-visible="true"]': {
                '--outline-width': '1px',
                outlineWidth: 'var(--outline-width)',
                outlineStyle: 'solid',
                outlineColor: 'accent.secondary',
                // The outline won't show since it's fully contained by its parent
                // Setting the offset to the same as the outline makes it show
                outlineOffset: '[calc(var(--outline-width) * -1)]',
            },
        },
    },
});

type CollapsibleWidgetRecipeVariantProps = RecipeVariantProps<typeof collapsibleWidgetRecipe>;

export { collapsibleWidgetRecipe };
export type { CollapsibleWidgetRecipeVariantProps };
