import { sva } from '@allenai/varnish-panda-runtime/css';
import { cx } from '@allenai/varnish-ui';
import { PropsWithChildren, useId } from 'react';

import {
    CollapsibleWidgetBase,
    type CollapsibleWidgetBaseProps,
} from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetBase';
import { CollapsibleWidgetFooter } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetFooter';
import { CollapsibleWidgetHeading } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetHeading';
import {
    CollapsibleWidgetPanel,
    CollapsibleWidgetPanelContent,
} from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetPanel';
import { CollapsibleWidgetTrigger } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetTrigger';
import { ExpandArrow } from '@/components/widgets/CollapsibleWidget/ExpandArrow';

import { ThinkingIcon } from '../svg/Thinking';
import { FadeOverflowContent } from './FadeOverflowContent';

const thinkingWidgetRecipe = sva({
    slots: ['container', 'footer'],
    base: {
        container: {
            maxWidth: '[672px]',
        },
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
            {...rest}>
            {({ isExpanded }) => {
                return (
                    <>
                        <CollapsibleWidgetHeading
                            startAdornment={<ThinkingIcon size="small" />}
                            endAdornment={<StatusIndicator />}
                            triggerAriaDescribedBy={footerId}>
                            {thinking ? 'Thinking' : 'Thoughts'}
                        </CollapsibleWidgetHeading>
                        <CollapsibleWidgetPanel>
                            <FadeOverflowContent className={contentClassName}>
                                <CollapsibleWidgetPanelContent contrast="off">
                                    {children}
                                </CollapsibleWidgetPanelContent>
                            </FadeOverflowContent>
                        </CollapsibleWidgetPanel>
                        <CollapsibleWidgetFooter bordered>
                            <CollapsibleWidgetTrigger className={thinkingWidgetClassNames.footer}>
                                <FooterContent isExpanded={isExpanded} id={footerId} />
                                <ExpandArrow />
                            </CollapsibleWidgetTrigger>
                        </CollapsibleWidgetFooter>
                    </>
                );
            }}
        </CollapsibleWidgetBase>
    );
};

interface FooterContentProps {
    isExpanded: boolean;
    id: string;
}

const FooterContent = ({ isExpanded, id }: FooterContentProps) => {
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
