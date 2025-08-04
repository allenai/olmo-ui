import { cx, sva } from '@allenai/varnish-panda-runtime/css';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

const fadeOverflowRecipe = sva({
    slots: ['container', 'fade', 'anchor'],
    base: {
        container: {
            backgroundColor: {
                base: 'cream.100',
                _dark: 'teal.100',
            },
            color: 'text',
            position: 'relative',
            overflowY: 'auto',
            padding: '5',
        },
        fade: {
            display: 'none',
            height: '[0]',
            position: 'sticky',
            bottom: '[0]',
            // transition: '[opacity 300ms ease-in-out]',
            color: {
                base: 'cream.100',
                _dark: 'teal.100',
            },
            _after: {
                content: '""',
                display: 'block',
                backgroundGradient: 'to-t',
                gradientFrom: '[currentColor]',
                gradientTo: '[currentColor/0]',
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
    },
    defaultVariants: {
        isVisible: false,
    },
});

interface FadeOverflowContentProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    fadeClassName?: string;
}

const FadeOverflowContent = ({
    className,
    fadeClassName,
    children,
    ...rest
}: FadeOverflowContentProps) => {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);

    const { ref: scrollAnchorRef } = useInView({
        root: container,
        initialInView: true,
        onChange: (inView) => {
            setIsScrolledToBottom(inView);
        },
    });

    const classNames = fadeOverflowRecipe({ isVisible: !isScrolledToBottom });

    return (
        <div
            className={cx(classNames.container, className)}
            ref={(el) => {
                setContainer(el);
            }}
            {...rest}>
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
