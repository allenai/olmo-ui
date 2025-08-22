import { cx } from '@allenai/varnish-panda-runtime/css';
import {
    Disclosure as AriaDisclosure,
    type DisclosureProps as AriaDisclosureProps,
} from 'react-aria-components';

import {
    collapsibleWidgetRecipe,
    type CollapsibleWidgetRecipeVariantProps,
} from './collapsibleWidget.styles';

interface CollapsibleWidgetBaseProps
    extends CollapsibleWidgetRecipeVariantProps,
        AriaDisclosureProps {
    className?: string; // overwrite RAC's className which takes a fn
}

const CollapsibleWidgetBase = ({ className, children, ...rest }: CollapsibleWidgetBaseProps) => {
    const [variantProps, localProps] = collapsibleWidgetRecipe.splitVariantProps(rest);
    const classNames = collapsibleWidgetRecipe(variantProps);
    return (
        <AriaDisclosure className={cx('group', classNames.container, className)} {...localProps}>
            {children}
        </AriaDisclosure>
    );
};

export { CollapsibleWidgetBase };
export type { CollapsibleWidgetBaseProps };
