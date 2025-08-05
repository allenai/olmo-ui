import { cx } from '@allenai/varnish-panda-runtime/css';
import { PropsWithChildren, ReactNode } from 'react';
import { Heading as AriaHeading } from 'react-aria-components';

import { collapsibleRecipe } from './collapsible.styles';
import { CollapsibleTrigger, CollapsibleTriggerProps } from './CollapsibleTrigger';

interface CollapsibleHeadingBaseProps extends PropsWithChildren {
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

interface CollapsibleHeadingProps extends CollapsibleHeadingBaseProps, CollapsibleTriggerProps {
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
            <CollapsibleTrigger className={triggerClass}>{children}</CollapsibleTrigger>
        </CollapsibleHeadingBase>
    );
};

export { CollapsibleHeading, CollapsibleHeadingBase };
export type { CollapsibleHeadingBaseProps, CollapsibleHeadingProps };
