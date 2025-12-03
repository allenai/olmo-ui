import { css, cva } from '@allenai/varnish-panda-runtime/css';
import { cx } from '@allenai/varnish-ui';
import {
    ArrowBackIosNew as ArrowBackward,
    ArrowForwardIos as ArrowForward,
} from '@mui/icons-material';
import { HTMLAttributes, useState } from 'react';
import { Button } from 'react-aria-components';
import { useInView } from 'react-intersection-observer';

const buttonClassName = cva({
    base: {
        background: 'background/50',
        color: 'text',
        '--horizontal-offset': '{spacing.2}',
        position: 'absolute',
        zIndex: '[2]',
        borderRadius: 'full',
        display: 'flex',
        opacity: '0',
        transition: '[opacity 150ms ease-in-out]',

        // vertically center absolutely positioned
        top: '[50%]',
        transform: '[translateY(-50%)',
        padding: '2',
        fontSize: '[1rem]',
    },
    variants: {
        direction: {
            prev: {
                left: 'var(--horizontal-offset)',
            },
            next: {
                right: 'var(--horizontal-offset)',
            },
        },
        visible: {
            true: {
                opacity: '1',
            },
        },
    },
});

const fade = cva({
    base: {
        pointerEvents: 'none',
        zIndex: '[1]',
        position: 'absolute',
        width: '[0]',
        height: '[100%]',
        top: '0',

        display: 'none',
        _after: {
            content: '""',
            display: 'block',
            position: 'absolute',
            width: '[40px]',
            height: '[100%]',
            gradientFrom: 'var(--background-color, {colors.background})',
            gradientTo: 'transparent',
            transition: '[opacity 150ms ease-in-out]',
        },
    },
    variants: {
        position: {
            start: {
                left: '0',
                _after: {
                    left: '[0]',
                    backgroundGradient: 'to-r',
                },
            },
            end: {
                right: '0',
                _after: {
                    right: '[0]',
                    backgroundGradient: 'to-l',
                },
            },
        },
        visible: {
            true: {
                display: 'block',
                _after: {
                    opacity: '1',
                },
            },
        },
    },
});

interface SliderFadeOverflowProps extends HTMLAttributes<HTMLDivElement> {
    contentClassName?: string;
    onPagerNext?: () => void;
    onPagerPrev?: () => void;
}

export const SliderFadeOverflow = ({
    children,
    className,
    contentClassName,
    onPagerPrev,
    onPagerNext,
    ...props
}: SliderFadeOverflowProps) => {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const [isAtStart, setIsAtStart] = useState(false);
    const [isAtEnd, setIsAtEnd] = useState(false);
    let hideBoth = false;

    const { ref: nextSchollAnchorRef } = useInView({
        root: container,
        initialInView: false,
        rootMargin: '1px',
        onChange: (inView) => {
            console.log('next', inView);
            setIsAtEnd(inView);
        },
    });

    const { ref: prevSchollAnchorRef } = useInView({
        root: container,
        initialInView: false,
        rootMargin: '1px',
        onChange: (inView) => {
            console.log('prev', inView);
            setIsAtStart(inView);
        },
    });

    if (isAtStart && isAtEnd) {
        hideBoth = true;
    }

    return (
        <div
            className={cx(
                css({
                    isolation: 'isolate',
                    position: 'relative',
                }),
                className
            )}
            {...props}>
            {onPagerPrev ? (
                <Button
                    className={buttonClassName({
                        direction: 'prev',
                        visible: !hideBoth && !isAtStart,
                    })}
                    onPress={onPagerPrev}>
                    <ArrowBackward fontSize="inherit" />
                </Button>
            ) : null}
            <div className={cx(fade({ position: 'start', visible: !hideBoth && !isAtStart }))} />
            <div
                ref={(el) => {
                    setContainer(el);
                }}
                className={cx(
                    css({
                        display: 'flex',
                        width: '[100%]',
                        containerType: 'inline-size',
                        overflowX: 'auto',
                    }),
                    contentClassName
                )}>
                <div ref={prevSchollAnchorRef} />
                {children}
                <div ref={nextSchollAnchorRef} />
            </div>
            <div className={cx(fade({ position: 'end', visible: !hideBoth && !isAtEnd }))} />
            {onPagerNext ? (
                <Button
                    className={buttonClassName({
                        direction: 'next',
                        visible: !hideBoth && !isAtEnd,
                    })}
                    onPress={onPagerNext}>
                    <ArrowForward fontSize="inherit" />
                </Button>
            ) : null}
        </div>
    );
};
