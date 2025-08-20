import { Meta, StoryObj } from '@storybook/react';

import { ChatIcon } from '@/components/assets/ChatIcon';

import { CollapsibleWidgetBase } from './CollapsibleWidgetBase';
import { CollapsibleWidgetFooter } from './CollapsibleWidgetFooter';
import { CollapsibleWidgetHeading } from './CollapsibleWidgetHeading';
import { CollapsibleWidgetPanel, CollapsibleWidgetPanelContent } from './CollapsibleWidgetPanel';
import { CollapsibleWidgetTrigger } from './CollapsibleWidgetTrigger';
import { ExpandArrow } from './ExpandArrow';

const meta: Meta<typeof CollapsibleWidgetBase> = {
    title: 'Widgets/Collapsible Composed',
    component: CollapsibleWidgetBase,
};

export default meta;

type Story = StoryObj<typeof CollapsibleWidgetBase>;

export const Default: Story = {
    args: {
        defaultExpanded: true,
        children: (
            <>
                <CollapsibleWidgetHeading
                    startAdornment={<ChatIcon />}
                    endAdornment={<ExpandArrow />}>
                    Heading
                </CollapsibleWidgetHeading>
                <CollapsibleWidgetPanel>
                    <CollapsibleWidgetPanelContent>
                        <pre>{'{\n  "city": "Seattle"\n}'}</pre>
                    </CollapsibleWidgetPanelContent>
                </CollapsibleWidgetPanel>
                <CollapsibleWidgetFooter bordered>Footer</CollapsibleWidgetFooter>
            </>
        ),
    },
};

export const FooterInsidePanel: Story = {
    args: {
        defaultExpanded: false,
        children: (
            <>
                <CollapsibleWidgetHeading endAdornment={<ExpandArrow />}>
                    Heading
                </CollapsibleWidgetHeading>
                <CollapsibleWidgetPanel>
                    <CollapsibleWidgetPanelContent>
                        <pre>{'{\n  "city": "Seattle"\n}'}</pre>
                    </CollapsibleWidgetPanelContent>
                    <CollapsibleWidgetFooter>Footer</CollapsibleWidgetFooter>
                </CollapsibleWidgetPanel>
            </>
        ),
    },
};

export const MultiplePanelContent: Story = {
    args: {
        defaultExpanded: true,
        children: (
            <>
                <CollapsibleWidgetHeading endAdornment={<ExpandArrow />}>
                    Heading
                </CollapsibleWidgetHeading>
                <CollapsibleWidgetPanel>
                    <CollapsibleWidgetPanelContent>
                        <pre>{'{\n  "city": "Seattle"\n}'}</pre>
                    </CollapsibleWidgetPanelContent>
                    <CollapsibleWidgetPanelContent contrast="high">
                        Top
                    </CollapsibleWidgetPanelContent>
                    <CollapsibleWidgetPanelContent contrast="low">
                        Middle
                    </CollapsibleWidgetPanelContent>
                </CollapsibleWidgetPanel>
                <CollapsibleWidgetFooter>Footer bottom</CollapsibleWidgetFooter>
            </>
        ),
    },
};

export const FooterWithTrigger: Story = {
    args: {
        defaultExpanded: false,
        children: (
            <>
                <CollapsibleWidgetHeading>Heading</CollapsibleWidgetHeading>
                <CollapsibleWidgetPanel>
                    <CollapsibleWidgetPanelContent>
                        <pre>{'{\n  "city": "Seattle"\n}'}</pre>
                    </CollapsibleWidgetPanelContent>
                </CollapsibleWidgetPanel>
                <CollapsibleWidgetFooter bordered>
                    <CollapsibleWidgetTrigger>
                        Footer bottom <ExpandArrow />
                    </CollapsibleWidgetTrigger>
                </CollapsibleWidgetFooter>
            </>
        ),
    },
};
