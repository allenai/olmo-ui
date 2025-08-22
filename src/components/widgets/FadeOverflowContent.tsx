import { cx, RecipeVariantProps, sva } from '@allenai/varnish-panda-runtime/css';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

const fadeOverflowRecipe = sva({
    slots: ['container', 'content', 'fade', 'anchor'],
    base: {
        container: {
            backgroundColor: 'var(--background-color, var(--variant-background-color))',
            color: 'text',
            position: 'relative',
            overflowY: 'auto',
        },
        fade: {
            display: 'none',
            height: '[0]',
            position: 'sticky',
            bottom: '[0]',
            // transition: '[opacity 300ms ease-in-out]',
            _after: {
                content: '""',
                display: 'block',
                backgroundGradient: 'to-t',
                gradientFrom: 'var(--background-color, var(--variant-background-color))',
                gradientTo: 'transparent',
                height: '[80px]',
                position: 'absolute',
                bottom: '[0]',
                width: '[100%]',
                pointerEvents: 'none',
                transition: '[opacity 300ms ease-in-out]',
            },
        },
        anchor: {
            height: '[0]',
        },
    },
    variants: {
        isVisible: {
            true: {
                fade: {
                    display: 'block',
                },
            },
            false: {}, // default
        },
        contrast: {
            low: {
                container: {
                    '--variant-background-color': 'colors.elements.overlay.content-contrast-low',
                },
            },
            medium: {
                container: {
                    '--variant-background-color': '{colors.elements.overlay.content-contrast-med}',
                },
            },
            high: {
                container: {
                    '--variant-background-color': 'colors.elements.overlay.content-contrast-high',
                },
            },
        },
    },
    defaultVariants: {
        isVisible: false,
        contrast: 'high',
    },
});

type FadeOverFlowVariantProps = Exclude<RecipeVariantProps<typeof fadeOverflowRecipe>, undefined>;

interface FadeOverflowContentProps
    extends FadeOverFlowVariantProps,
        React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    fadeClassName?: string;
}

const FadeOverflowContent = ({
    className,
    fadeClassName,
    children,
    ...rest
}: FadeOverflowContentProps) => {
    const [variantProps, localProps] = fadeOverflowRecipe.splitVariantProps(rest);
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);

    const { ref: scrollAnchorRef } = useInView({
        root: container,
        initialInView: true,
        onChange: (inView) => {
            setIsScrolledToBottom(inView);
        },
    });

    const classNames = fadeOverflowRecipe({
        ...variantProps,
        isVisible: !isScrolledToBottom,
    });

    return (
        <div
            className={cx(classNames.container, className)}
            ref={(el) => {
                setContainer(el);
            }}
            {...localProps}>
            {children}
            <div
                className={cx(classNames.fade, fadeClassName)}
                data-is-visible={!isScrolledToBottom}
            />
            <div className={classNames.anchor} ref={scrollAnchorRef} />
        </div>
    );
};

export { FadeOverflowContent };
