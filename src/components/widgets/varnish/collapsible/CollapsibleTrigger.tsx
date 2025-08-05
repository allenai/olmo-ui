import { css } from '@allenai/varnish-panda-runtime/css';
import { cx } from '@allenai/varnish-ui';
import { type PropsWithChildren } from 'react';
import { Button as AriaButton } from 'react-aria-components';

const collapsibleTriggerClassName = css({
    display: 'flex',
    flexGrow: '1',
    justifyContent: 'space-between',
});

interface CollapsibleTriggerProps extends PropsWithChildren {
    className?: string;
}

const CollapsibleTrigger = ({ className, children }: CollapsibleTriggerProps) => {
    return (
        <AriaButton slot="trigger" className={cx(collapsibleTriggerClassName, className)}>
            {children}
        </AriaButton>
    );
};

export { CollapsibleTrigger };
export type { CollapsibleTriggerProps };
