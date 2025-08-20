import { cx } from '@allenai/varnish-ui';
import { Button as AriaButton, ButtonProps as AriaButtonProps } from 'react-aria-components';

import { collapsibleWidgetRecipe } from './collapsibleWidget.styles';

interface CollapsibleWidgetTriggerProps extends AriaButtonProps {
    className?: string;
}

const CollapsibleWidgetTrigger = ({
    className,
    children,
    ...rest
}: CollapsibleWidgetTriggerProps) => {
    const [variantProps, localProps] = collapsibleWidgetRecipe.splitVariantProps(rest);
    const classNames = collapsibleWidgetRecipe(variantProps);

    return (
        <AriaButton slot="trigger" className={cx(classNames.trigger, className)} {...localProps}>
            {children}
        </AriaButton>
    );
};

export { CollapsibleWidgetTrigger };
export type { CollapsibleWidgetTriggerProps };
