import { css } from '@allenai/varnish-panda-runtime/css';

import { CollapsibleWidgetBase } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetBase';
import { CollapsibleWidgetFooter } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetFooter';
import { CollapsibleWidgetHeading } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetHeading';
import {
    CollapsibleWidgetPanel,
    CollapsibleWidgetPanelContent,
} from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetPanel';
import { CollapsibleWidgetTrigger } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetTrigger';
import { ExpandArrow } from '@/components/widgets/CollapsibleWidget/ExpandArrow';

import { ThinkingIcon } from '../svg/Thinking';

const thinkingFooter = css({
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    justifyItems: 'left',
});

const ThinkingWidet = () => {
    return (
        <CollapsibleWidgetBase className={css({ maxWidth: '[672px]' })}>
            {({ isExpanded }) => {
                return (
                    <>
                        <CollapsibleWidgetHeading
                            startAdornment={<ThinkingIcon size="small" />}
                            endAdornment={<StatusIndicator />}>
                            Thinking
                        </CollapsibleWidgetHeading>
                        <CollapsibleWidgetPanel>
                            <CollapsibleWidgetPanelContent>
                                <p>Thinking...</p>
                            </CollapsibleWidgetPanelContent>
                        </CollapsibleWidgetPanel>
                        <CollapsibleWidgetFooter bordered>
                            <CollapsibleWidgetTrigger className={thinkingFooter}>
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

export { ThinkingWidet };
