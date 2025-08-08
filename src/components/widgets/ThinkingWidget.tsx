import { css, sva } from '@allenai/varnish-panda-runtime/css';
import { cx } from '@allenai/varnish-ui';
import { PropsWithChildren } from 'react';

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
}

const ThinkingWidget = ({
    className,
    contentClassName,
    children,
    ...rest
}: ThinkingWidgetProps) => {
    const thinkingWidgetClassNames = thinkingWidgetRecipe();
    return (
        <CollapsibleWidgetBase
            className={cx(thinkingWidgetClassNames.container, className)}
            {...rest}>
            {({ isExpanded }) => {
                return (
                    <>
                        <CollapsibleWidgetHeading
                            startAdornment={<ThinkingIcon size="small" />}
                            endAdornment={<StatusIndicator />}>
                            Thinking
                        </CollapsibleWidgetHeading>
                        <CollapsibleWidgetPanel>
                            <FadeOverflowContent className={contentClassName}>
                                <CollapsibleWidgetPanelContent>
                                    {children}
                                </CollapsibleWidgetPanelContent>
                            </FadeOverflowContent>
                        </CollapsibleWidgetPanel>
                        <CollapsibleWidgetFooter bordered>
                            <CollapsibleWidgetTrigger className={thinkingWidgetClassNames.footer}>
                                <FooterContent isExpanded={isExpanded} />
                                <ExpandArrow />
                            </CollapsibleWidgetTrigger>
                        </CollapsibleWidgetFooter>
                    </>
                );
            }}
        </CollapsibleWidgetBase>
    );
};

const FooterContent = ({ isExpanded }: { isExpanded: boolean }) => {
    return (
        <span>
            {isExpanded ? 'Collapse to hide model thoughts' : 'Expand to view model thoughts'}
        </span>
    );
};

const StatusIndicator = () => {
    return <span>•••</span>;
};

export { ThinkingWidget };
