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
        background: '[red]',
        '--horizontal-offset': '{spacing.2}',
        position: 'absolute',
        alignSelf: 'center',
        zIndex: '[1]',
        borderRadius: 'full',

        display: 'flex',
        //
        alignItems: 'center',
        justifyItems: 'center',
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
                //
            },
        },
    },
});

interface SliderPagerProps extends HTMLAttributes<HTMLDivElement> {
    prevClassName?: string;
    nextClassName?: string;
}

export const SliderPager = ({
    children,
    className,
    prevClassName,
    nextClassName,
    ...props
}: SliderPagerProps) => {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    // const containerRef = useRef<HTMLDivElement | null>(null);
    // probably sane defaults
    const [isAtStart, setIsAtStart] = useState(false);
    const [isAtEnd, setIsAtEnd] = useState(false);
    let hide = false;

    const { ref: prevSchollAnchorRef } = useInView({
        root: container,
        initialInView: true,
        rootMargin: '1px',
        onChange: (inView) => {
            setIsAtStart(inView);
        },
    });

    const { ref: nextSchollAnchorRef } = useInView({
        root: container,
        initialInView: true,
        rootMargin: '1px',
        onChange: (inView) => {
            setIsAtEnd(inView);
        },
    });

    if (isAtStart && isAtEnd) {
        // both visible
        hide = true;
    }

    return (
        <div
            ref={(el) => {
                setContainer(el);
            }}
            className={cx(
                css({
                    display: 'contents', // just playing with it
                }),
                className
            )}
            {...props}>
            <div className={prevClassName} ref={prevSchollAnchorRef} />
            <Button className={buttonClassName({ direction: 'prev', visible: !hide || isAtStart })}>
                <ArrowBackward />
            </Button>
            {children}
            <Button className={buttonClassName({ direction: 'next', visible: !hide || isAtEnd })}>
                <ArrowForward />
            </Button>
            <div className={nextClassName} ref={nextSchollAnchorRef} />
        </div>
    );
};
