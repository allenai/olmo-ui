import { sva } from '@allenai/varnish-panda-runtime/css';
import { cx } from '@allenai/varnish-ui';
import { CircularProgress } from '@mui/material';
import { type PropsWithChildren } from 'react';

import {
    CollapsibleWidgetBase,
    type CollapsibleWidgetBaseProps,
} from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetBase';
import { CollapsibleWidgetContent } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetContent';
import { CollapsibleWidgetHeading } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetHeading';
import { CollapsibleWidgetPanel } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetPanel';

import { ThinkingIcon } from '../svg/Thinking';
import { CollapseButton } from './CollapsibleWidget/CollapseButton';
import { ExpandArrowContextAware } from './CollapsibleWidget/ExpandArrow';

const thinkingWidgetRecipe = sva({
    slots: [
        'container',
        'heading',
        'trigger',
        'thinkingInProgressIndicator',
        'panel',
        'content',
        'collapse',
    ],
    base: {
        container: {
            '--background-color': '{colors.background}',
            '--spinner-color': '{colors.icon}',
            backgroundColor: 'var(--background-color)',
            boxShadow: 'none',
        },
        heading: {
            alignSelf: 'start',
            backgroundColor: 'transparent',
        },
        trigger: {
            fontWeight: 'medium',
            justifyContent: 'start',
            paddingBlock: '0',
            paddingInline: '0',
        },
        content: {
            marginBlockStart: '4',
            paddingBlock: '0',
            paddingInlineStart: '3',
            borderLeft: '1px solid',
            borderLeftColor: 'elements.default.stroke',
        },
        collapse: {
            fontWeight: 'medium',
            display: 'flex',
            gap: '2',
            marginBlockStart: '2',
            alignSelf: 'start',
            cursor: 'pointer',
        },
    },
});

interface ThinkingWidgetProps
    extends Omit<CollapsibleWidgetBaseProps, 'children'>,
        PropsWithChildren {
    contentClassName?: string;
    isThinkingInProgress: boolean;
}

const ThinkingWidget = ({
    className,
    contentClassName,
    children,
    isThinkingInProgress,
    ...rest
}: ThinkingWidgetProps) => {
    const thinkingWidgetClassNames = thinkingWidgetRecipe();

    return (
        <CollapsibleWidgetBase
            variant="transparent"
            contrast="off"
            className={cx(thinkingWidgetClassNames.container, className)}
            data-widget-type="thinking"
            {...rest}>
            <CollapsibleWidgetHeading
                className={thinkingWidgetClassNames.heading}
                triggerClassName={thinkingWidgetClassNames.trigger}
                startAdornment={<ThinkingIcon size="small" />}
                aria-label={isThinkingInProgress ? 'Thinking' : 'Not thinking'}
                endAdornment={
                    isThinkingInProgress ? (
                        <CircularProgress size="1em" sx={{ color: 'var(--spinner-color)' }} />
                    ) : (
                        <ExpandArrowContextAware />
                    )
                }>
                <span>{isThinkingInProgress ? 'Thinking' : 'Thoughts'}</span>
            </CollapsibleWidgetHeading>
            <CollapsibleWidgetPanel className={thinkingWidgetClassNames.panel}>
                <CollapsibleWidgetContent
                    className={thinkingWidgetClassNames.content}
                    contrast="off">
                    {children}
                </CollapsibleWidgetContent>
                <CollapseButton className={thinkingWidgetClassNames.collapse}>
                    Collapse
                    <ExpandArrowContextAware />
                </CollapseButton>
            </CollapsibleWidgetPanel>
        </CollapsibleWidgetBase>
    );
};

export { ThinkingWidget };
