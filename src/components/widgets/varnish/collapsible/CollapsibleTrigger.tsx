import { css } from '@allenai/varnish-panda-runtime/css';
import { cx } from '@allenai/varnish-ui';
import { Button as AriaButton, ButtonProps as AriaButtonProps } from 'react-aria-components';

const collapsibleTriggerClassName = css({
    display: 'flex',
    flexGrow: '1',
    justifyContent: 'space-between',
});

interface CollapsibleTriggerProps extends AriaButtonProps {
    className?: string;
}

const CollapsibleTrigger = ({ className, children, ...rest }: CollapsibleTriggerProps) => {
    return (
        <AriaButton slot="trigger" className={cx(collapsibleTriggerClassName, className)} {...rest}>
            {children}
        </AriaButton>
    );
};

export { CollapsibleTrigger };
export type { CollapsibleTriggerProps };
