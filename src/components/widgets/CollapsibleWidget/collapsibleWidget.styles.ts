import { sva } from '@allenai/varnish-panda-runtime/css';
import { type RecipeVariantProps } from '@allenai/varnish-panda-runtime/types';

const collapsibleWidgetRecipe = sva({
    slots: ['container', 'heading', 'panel', 'panelContent', 'trigger'],
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
            backgroundColor: 'elements.overlay.background',
            color: 'text',
            borderRadius: 'sm',
            overflow: 'hidden',
            boxShadow: '0 2px 2px 0 rgba(0, 0, 0, 0.15)',
            '--padding-block': 'spacing.3',
            '--padding-inline': 'spacing.4',
        },
        heading: {
            display: 'flex',
            backgroundColor: 'elements.overlay.header',
        },
        panel: {
            display: 'flex',
            flexDirection: 'column',
            minHeight: '[0]',
            // Note: not cross-browser animation/transition
            // RAC uses `hidden` on the panel, which isn't animatible (in firefox)
            // This currently works on chrome
            // To do this on FF and Safari, we may need to do more custom stuff in the RAC component
            // or replace it...

            transitionBehavior: 'allow-discrete',
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
            width: '[100%]',
            paddingInline: 'var(--padding-inline)',
            paddingBlock: 'var(--padding-block)',
        },
        trigger: {
            display: 'flex',
            width: '[100%]',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '3',
            paddingInline: 'var(--padding-inline)',
            paddingBlock: 'var(--padding-block)',

            cursor: 'pointer',

            _focusVisible: {
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
    variants: {
        contrast: {
            off: {
                panelContent: {}, // no backgroundColor
            },
            low: {
                panelContent: {
                    backgroundColor: 'elements.overlay.content-contrast-low',
                },
            },
            medium: {
                panelContent: {
                    backgroundColor: 'elements.overlay.content-contrast-med',
                },
            },
            high: {
                panelContent: {
                    backgroundColor: 'elements.overlay.content-contrast-high',
                },
            },
        },
    },
    defaultVariants: {
        contrast: 'medium',
    },
});

type CollapsibleWidgetRecipeVariantProps = Exclude<
    RecipeVariantProps<typeof collapsibleWidgetRecipe>,
    undefined
>;

export { collapsibleWidgetRecipe };
export type { CollapsibleWidgetRecipeVariantProps };
