import { cx } from '@allenai/varnish-panda-runtime/css';
import {
    Disclosure as AriaDisclosure,
    type DisclosureProps as AriaDisclosureProps,
} from 'react-aria-components';

import { collapsibleRecipe } from './collapsible.styles';

interface CollapsibleBaseProps extends AriaDisclosureProps {
    className?: string; // overwrite RAC's className which takes a fn
}

const CollapsibleBase = ({ className, children, ...rest }: CollapsibleBaseProps) => {
    const [variantProps, localProps] = collapsibleRecipe.splitVariantProps(rest);
    const classNames = collapsibleRecipe(variantProps);
    return (
        <AriaDisclosure className={cx('group', classNames.container, className)} {...localProps}>
            {children}
        </AriaDisclosure>
    );
};

export { CollapsibleBase };
export type { CollapsibleBaseProps };
