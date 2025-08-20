import { css, cx } from '@allenai/varnish-panda-runtime/css';
import { HTMLAttributes, PropsWithChildren, ReactNode, useContext } from 'react';
import {
    DisclosureStateContext,
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

const createTriggerAriaLabel = (
    isExpanded: boolean,
    ariaLabel: string | undefined
): string | undefined => {
    const prefix = isExpanded ? 'Collapse' : 'Expand';
    if (ariaLabel == null) {
        return undefined;
    }

    return `${prefix} ${ariaLabel}`;
};

interface CollapsibleWidgetHeadingProps extends CollapsibleWidgetHeadingBaseProps {
    triggerClassName?: string;
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
    triggerAriaDescribedBy?: string;
}

const CollapsibleWidgetHeading = ({
    className,
    triggerClassName,
    startAdornment,
    endAdornment,
    children,
    'aria-label': ariaLabel,
    triggerAriaDescribedBy,
    ...rest
}: CollapsibleWidgetHeadingProps) => {
    const disclosureState = useContext(DisclosureStateContext);
    const isExpanded = disclosureState?.isExpanded ?? false;

    const triggerAriaLabel = createTriggerAriaLabel(isExpanded, ariaLabel);

    return (
        <CollapsibleWidgetHeadingBase className={className} aria-label={ariaLabel} {...rest}>
            <CollapsibleWidgetTrigger
                className={triggerClassName}
                aria-label={triggerAriaLabel}
                aria-describedby={triggerAriaDescribedBy}>
                {startAdornment}
                <CollapsibleWidgetTitle>{children}</CollapsibleWidgetTitle>
                {endAdornment}
            </CollapsibleWidgetTrigger>
        </CollapsibleWidgetHeadingBase>
    );
};

export { CollapsibleWidgetHeading, CollapsibleWidgetHeadingBase };
export type { CollapsibleWidgetHeadingBaseProps, CollapsibleWidgetHeadingProps };
