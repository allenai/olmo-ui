import { Meta, StoryObj } from '@storybook/react';

import { ChatIcon } from '@/components/assets/ChatIcon';

import { CollapsibleBase } from './CollapsibleBase';
import { CollapsibleFooter } from './CollapsibleFooter';
import { CollapsibleHeading } from './CollapsibleHeading';
import { CollapsiblePanel, CollapsiblePanelContent } from './CollapsiblePanel';
import { CollapsibleTrigger } from './CollapsibleTrigger';
import { ExpandArrow } from './ExpandArrow';

const meta: Meta<typeof CollapsibleBase> = {
    title: 'Widgets/Collapsible Composed',
    component: CollapsibleBase,
};

export default meta;

type Story = StoryObj<typeof CollapsibleBase>;

export const Default: Story = {
    args: {
        defaultExpanded: true,
        children: (
            <>
                <CollapsibleHeading startAdornment={<ChatIcon />} endAdornment={<ExpandArrow />}>
                    Heading
                </CollapsibleHeading>
                <CollapsiblePanel>
                    <CollapsiblePanelContent>
                        <pre>{'{\n  "city": "Seattle"\n}'}</pre>
                    </CollapsiblePanelContent>
                </CollapsiblePanel>
                <CollapsibleFooter bordered={true}>Footer</CollapsibleFooter>
            </>
        ),
    },
};

export const FooterInsidePanel: Story = {
    args: {
        defaultExpanded: false,
        children: (
            <>
                <CollapsibleHeading endAdornment={<ExpandArrow />}>Heading</CollapsibleHeading>
                <CollapsiblePanel>
                    <CollapsiblePanelContent>
                        <pre>{'{\n  "city": "Seattle"\n}'}</pre>
                    </CollapsiblePanelContent>
                    <CollapsibleFooter>Footer</CollapsibleFooter>
                </CollapsiblePanel>
            </>
        ),
    },
};

export const AlertatingFooters: Story = {
    args: {
        defaultExpanded: true,
        children: (
            <>
                <CollapsibleHeading endAdornment={<ExpandArrow />}>Heading</CollapsibleHeading>
                <CollapsiblePanel>
                    <CollapsiblePanelContent>
                        <pre>{'{\n  "city": "Seattle"\n}'}</pre>
                    </CollapsiblePanelContent>
                    <CollapsibleFooter>Top</CollapsibleFooter>
                    <CollapsibleFooter variant="alternate">Middle</CollapsibleFooter>
                    <CollapsibleFooter>Footer bottom</CollapsibleFooter>
                </CollapsiblePanel>
            </>
        ),
    },
};

export const FooterWithTrigger: Story = {
    args: {
        defaultExpanded: false,
        children: (
            <>
                <CollapsibleHeading>Heading</CollapsibleHeading>
                <CollapsiblePanel>
                    <CollapsiblePanelContent>
                        <pre>{'{\n  "city": "Seattle"\n}'}</pre>
                    </CollapsiblePanelContent>
                </CollapsiblePanel>
                <CollapsibleFooter bordered>
                    <CollapsibleTrigger>
                        Footer bottom <ExpandArrow />
                    </CollapsibleTrigger>
                </CollapsibleFooter>
            </>
        ),
    },
};
