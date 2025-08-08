import { css, cx } from '@allenai/varnish-panda-runtime/css';
import { HTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import {
    Heading as AriaHeading,
    type HeadingProps as AriaHeadingProps,
} from 'react-aria-components';

import { collapsibleWidgetRecipe } from './collapsibleWidget.styles';
import { CollapsibleWidgetTrigger } from './CollapsibleWidgetTrigger';

const titleAlignClassName = css({
    flexGrow: '1',
    textAlign: 'left',
});

interface CollapsibleWidgetHeadingBaseProps extends AriaHeadingProps, PropsWithChildren {
    className?: string;
}

const CollapsibleWidgetHeadingBase = ({
    className,
    children,
    ...rest
}: CollapsibleWidgetHeadingBaseProps) => {
    const [variantProps, localProps] = collapsibleWidgetRecipe.splitVariantProps(rest);
    const classNames = collapsibleWidgetRecipe(variantProps);
    return (
        <AriaHeading className={cx(classNames.heading, className)} {...localProps}>
            {children}
        </AriaHeading>
    );
};

const CollapsibleWidgetTitle = ({
    children,
    className,
    ...rest
}: HTMLAttributes<HTMLSpanElement>) => {
    return (
        <span className={cx(titleAlignClassName, className)} {...rest}>
            {children}
        </span>
    );
};

interface CollapsibleWidgetHeadingProps extends CollapsibleWidgetHeadingBaseProps {
    triggerClassName?: string;
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
}

const CollapsibleWidgetHeading = ({
    className,
    triggerClassName,
    startAdornment,
    endAdornment,
    children,
    ...rest
}: CollapsibleWidgetHeadingProps) => {
    return (
        <CollapsibleWidgetHeadingBase className={className} {...rest}>
            <CollapsibleWidgetTrigger className={triggerClassName}>
                {startAdornment}
                <CollapsibleWidgetTitle>{children}</CollapsibleWidgetTitle>
                {endAdornment}
            </CollapsibleWidgetTrigger>
        </CollapsibleWidgetHeadingBase>
    );
};

export { CollapsibleWidgetHeading, CollapsibleWidgetHeadingBase };
export type { CollapsibleWidgetHeadingBaseProps, CollapsibleWidgetHeadingProps };
