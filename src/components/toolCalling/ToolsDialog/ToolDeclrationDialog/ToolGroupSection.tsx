import { css } from '@allenai/varnish-panda-runtime/css';
import { Checkbox, Link, LinkProps } from '@allenai/varnish-ui';
import { useContext } from 'react';
import {
    Button as AriaButton,
    Disclosure,
    DisclosureStateContext,
    Heading,
    PressEvent,
} from 'react-aria-components';
import { useController, type UseControllerProps } from 'react-hook-form';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { SchemaAvailableTool } from '@/api/playgroundApi/playgroundApiSchema';
import { CollapsibleWidgetPanel } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetPanel';
import { ExpandArrowButton } from '@/components/widgets/CollapsibleWidget/ExpandArrow';

import { DataFields } from './ToolDeclarationDialog';
import {
    addToolsToSelected,
    allToolsInGroupSelected,
    removeToolsFromSelected,
    toSpacedCase,
} from './toolDeclarationUtils';

interface ControlledToggleTableProps {
    control?: Omit<UseControllerProps<DataFields>, 'name'>;
    tools: Model['available_tools'];
    isDisabled?: boolean;
}

const toolNameGrid = css({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    smDown: {
        gridTemplateColumns: '1fr',
    },
    gap: '4',
    padding: '3',
    border: '1px solid',
    borderColor: 'elements.faded.stroke', // or 'text'
    borderRadius: 'sm',
    alignContent: 'start',
    flex: '1',
});

const toolName = css({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: 'md',
    fontWeight: 'medium',
    maxWidth: '[300px]',
});

const realToolName = css({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '[300px]',
    marginLeft: '[22px]',
    fontSize: 'sm',
});

const SelectUnselectLink = ({
    isDisabled,
    onPress,
    'aria-label': ariaLabel,
    children,
}: LinkProps) => {
    const disclosureState = useContext(DisclosureStateContext);
    const handlePress = (e: PressEvent) => {
        disclosureState?.expand();
        onPress?.(e);
    };
    return (
        <Link isDisabled={isDisabled} onPress={handlePress} aria-label={ariaLabel}>
            {children}
        </Link>
    );
};

type ToolGroupSectionProps = {
    toolGroupName: string;
    groupTools: SchemaAvailableTool[];
    isDisabled?: boolean;
    control: ControlledToggleTableProps['control'];
};

const toolCallGroupClassName = css({
    display: 'grid',
    gap: '1',
});

const toolGroupHeadingClassName = css({
    display: 'flex',
    gap: '2',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingInlineEnd: '1',
});

const headingButtonWithArrowClassName = css({
    display: 'flex',
    gap: '1',
    alignItems: 'center',
    fontWeight: 'semiBold',
    cursor: 'pointer',
});

export const ToolGroupSection = ({
    toolGroupName,
    groupTools,
    isDisabled,
    control,
}: ToolGroupSectionProps) => {
    const { field } = useController({
        name: 'tools',
        ...control,
        defaultValue: [],
        rules: {},
    });

    const selectedTools = field.value;
    const groupToolNames = groupTools.map((tool) => tool.name);
    const areAllSelected = allToolsInGroupSelected(field.value, groupToolNames);

    const handleToggle = (tool: string, isChecked: boolean) => {
        const newSelectedTools = isChecked
            ? addToolsToSelected(selectedTools, [tool])
            : removeToolsFromSelected(selectedTools, [tool]);

        field.onChange(newSelectedTools);
    };

    const handleSelectAll = () => {
        const newSelectedTools = areAllSelected
            ? removeToolsFromSelected(selectedTools, groupToolNames)
            : addToolsToSelected(selectedTools, groupToolNames);

        field.onChange(newSelectedTools);
    };

    const selectionLabel = areAllSelected ? 'Unselect all' : 'Select all';

    return (
        <Disclosure defaultExpanded className={toolCallGroupClassName}>
            <div className={toolGroupHeadingClassName}>
                <Heading>
                    <AriaButton slot="trigger" className={headingButtonWithArrowClassName}>
                        <ExpandArrowButton />
                        {toolGroupName}
                    </AriaButton>
                </Heading>
                <SelectUnselectLink
                    isDisabled={isDisabled}
                    onPress={handleSelectAll}
                    aria-label={`${selectionLabel} from ${toolGroupName}`}>
                    {selectionLabel}
                </SelectUnselectLink>
            </div>
            <CollapsibleWidgetPanel>
                <div className={toolNameGrid}>
                    {groupTools.map((tool) => (
                        <div key={tool.name}>
                            <Checkbox
                                isDisabled={isDisabled}
                                isSelected={field.value.includes(tool.name) || false}
                                onChange={(isChecked) => {
                                    handleToggle(tool.name, isChecked);
                                }}
                                aria-label={`Toggle ${tool.name} tool`}>
                                <span className={toolName}>{toSpacedCase(tool.name)}</span>
                            </Checkbox>
                            <div className={realToolName}>{tool.name}</div>
                        </div>
                    ))}
                </div>
            </CollapsibleWidgetPanel>
        </Disclosure>
    );
};
