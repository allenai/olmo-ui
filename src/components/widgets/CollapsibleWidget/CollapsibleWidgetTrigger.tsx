import { css } from '@allenai/varnish-panda-runtime/css';
import { cx } from '@allenai/varnish-ui';
import { Button as AriaButton, ButtonProps as AriaButtonProps } from 'react-aria-components';

const collapsibleWidgetTriggerClassName = css({
    display: 'flex',
    flexGrow: '1',
    justifyContent: 'space-between',
    gap: '3',
    cursor: 'pointer',
});

interface CollapsibleWidgetTriggerProps extends AriaButtonProps {
    className?: string;
}

const CollapsibleWidgetTrigger = ({
    className,
    children,
    ...rest
}: CollapsibleWidgetTriggerProps) => {
    return (
        <AriaButton
            slot="trigger"
            className={cx(collapsibleWidgetTriggerClassName, className)}
            {...rest}>
            {children}
        </AriaButton>
    );
};

export { CollapsibleWidgetTrigger };
export type { CollapsibleWidgetTriggerProps };
