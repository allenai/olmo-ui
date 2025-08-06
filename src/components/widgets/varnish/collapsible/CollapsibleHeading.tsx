import { css, cx } from '@allenai/varnish-panda-runtime/css';
import { HTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import {
    Heading as AriaHeading,
    type HeadingProps as AriaHeadingProps,
} from 'react-aria-components';

import { collapsibleRecipe } from './collapsible.styles';
import { CollapsibleTrigger } from './CollapsibleTrigger';

const titleAlignClassName = css({
    flexGrow: '1',
    textAlign: 'left',
});

interface CollapsibleHeadingBaseProps extends AriaHeadingProps, PropsWithChildren {
    className?: string;
}

const CollapsibleHeadingBase = ({ className, children, ...rest }: CollapsibleHeadingBaseProps) => {
    const [variantProps, localProps] = collapsibleRecipe.splitVariantProps(rest);
    const classNames = collapsibleRecipe(variantProps);
    return (
        <AriaHeading className={cx(classNames.heading, className)} {...localProps}>
            {children}
        </AriaHeading>
    );
};

const CollapsibleTitle = ({ children, className, ...rest }: HTMLAttributes<HTMLSpanElement>) => {
    return (
        <span className={cx(titleAlignClassName, className)} {...rest}>
            {children}
        </span>
    );
};

interface CollapsibleHeadingProps extends CollapsibleHeadingBaseProps {
    triggerClass?: string;
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
}

const CollapsibleHeading = ({
    className,
    triggerClass,
    startAdornment,
    endAdornment,
    children,
    ...rest
}: CollapsibleHeadingProps) => {
    return (
        <CollapsibleHeadingBase className={className} {...rest}>
            <CollapsibleTrigger className={triggerClass}>
                {startAdornment}
                <CollapsibleTitle>{children}</CollapsibleTitle>
                {endAdornment}
            </CollapsibleTrigger>
        </CollapsibleHeadingBase>
    );
};

export { CollapsibleHeading, CollapsibleHeadingBase };
export type { CollapsibleHeadingBaseProps, CollapsibleHeadingProps };
