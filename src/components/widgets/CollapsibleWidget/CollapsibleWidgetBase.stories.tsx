import { Meta, StoryObj } from '@storybook/react-vite';

import { ChatIcon } from '@/components/assets/ChatIcon';

import { CollapsibleWidgetBase } from './CollapsibleWidgetBase';
import { CollapsibleWidgetContent } from './CollapsibleWidgetContent';
import { CollapsibleWidgetFooter, CollapsibleWidgetFooterBase } from './CollapsibleWidgetFooter';
import { CollapsibleWidgetHeading } from './CollapsibleWidgetHeading';
import { CollapsibleWidgetPanel } from './CollapsibleWidgetPanel';
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
                    <CollapsibleWidgetContent>
                        <pre>{'{\n  "city": "Seattle"\n}'}</pre>
                    </CollapsibleWidgetContent>
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
                    <CollapsibleWidgetContent>
                        <pre>{'{\n  "city": "Seattle"\n}'}</pre>
                    </CollapsibleWidgetContent>
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
                    <CollapsibleWidgetContent>
                        <pre>{'{\n  "city": "Seattle"\n}'}</pre>
                    </CollapsibleWidgetContent>
                    <CollapsibleWidgetContent contrast="high">Top</CollapsibleWidgetContent>
                    <CollapsibleWidgetContent contrast="low">Middle</CollapsibleWidgetContent>
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
                    <CollapsibleWidgetContent>
                        <pre>{'{\n  "city": "Seattle"\n}'}</pre>
                    </CollapsibleWidgetContent>
                </CollapsibleWidgetPanel>
                <CollapsibleWidgetFooterBase bordered>
                    <CollapsibleWidgetTrigger>
                        Footer bottom <ExpandArrow />
                    </CollapsibleWidgetTrigger>
                </CollapsibleWidgetFooterBase>
            </>
        ),
    },
};
