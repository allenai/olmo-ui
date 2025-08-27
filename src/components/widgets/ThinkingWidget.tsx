import { sva } from '@allenai/varnish-panda-runtime/css';
import { cx } from '@allenai/varnish-ui';
import { PropsWithChildren, useContext, useId } from 'react';
import { DisclosureStateContext } from 'react-aria-components';

import {
    CollapsibleWidgetBase,
    type CollapsibleWidgetBaseProps,
} from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetBase';
import { CollapsibleWidgetContent } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetContent';
import { CollapsibleWidgetFooterBase } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetFooter';
import { CollapsibleWidgetHeading } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetHeading';
import { CollapsibleWidgetPanel } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetPanel';
import { CollapsibleWidgetTrigger } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetTrigger';
import { ExpandArrowButton } from '@/components/widgets/CollapsibleWidget/ExpandArrow';

import { ThinkingIcon } from '../svg/Thinking';
import { FadeOverflowContent } from './FadeOverflowContent';

const thinkingWidgetRecipe = sva({
    slots: ['container', 'footer'],
    base: {
        container: {},
        footer: {
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            justifyItems: 'left',
        },
    },
});

interface ThinkingWidgetProps
    extends Omit<CollapsibleWidgetBaseProps, 'children'>,
        PropsWithChildren {
    contentClassName?: string;
    thinking: boolean;
}

const ThinkingWidget = ({
    className,
    contentClassName,
    children,
    thinking,
    ...rest
}: ThinkingWidgetProps) => {
    const thinkingWidgetClassNames = thinkingWidgetRecipe();
    const footerId = useId();

    return (
        <CollapsibleWidgetBase
            className={cx(thinkingWidgetClassNames.container, className)}
            data-widget-type="thinking"
            {...rest}>
            <CollapsibleWidgetHeading
                startAdornment={<ThinkingIcon size="small" />}
                endAdornment={<StatusIndicator />}
                triggerAriaDescribedBy={footerId}>
                {thinking ? 'Thinking' : 'Thoughts'}
            </CollapsibleWidgetHeading>
            <CollapsibleWidgetPanel>
                <FadeOverflowContent className={contentClassName}>
                    <CollapsibleWidgetContent contrast="off">{children}</CollapsibleWidgetContent>
                </FadeOverflowContent>
            </CollapsibleWidgetPanel>
            <CollapsibleWidgetFooterBase bordered>
                <CollapsibleWidgetTrigger>
                    <FooterContent id={footerId} />
                    <ExpandArrowButton />
                </CollapsibleWidgetTrigger>
            </CollapsibleWidgetFooterBase>
        </CollapsibleWidgetBase>
    );
};

interface FooterContentProps {
    id: string;
}

const FooterContent = ({ id }: FooterContentProps) => {
    const disclosureState = useContext(DisclosureStateContext);
    const isExpanded = disclosureState?.isExpanded ?? false;

    return (
        <span id={id}>
            {isExpanded ? 'Collapse to hide model thoughts' : 'Expand to view model thoughts'}
        </span>
    );
};

const StatusIndicator = () => {
    return <span aria-hidden>•••</span>;
};

export { ThinkingWidget };
