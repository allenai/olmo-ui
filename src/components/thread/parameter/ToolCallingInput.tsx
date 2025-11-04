import {
    ParameterToggle,
    type ParameterToggleProps,
} from '@/components/thread/parameter/inputs/ParameterToggle';
import { TOOL_CALLING_INFO } from '@/components/toolCalling/toolCallingConsts';
import { useToolsDialog } from '@/components/toolCalling/ToolsDialog/useToolsDialog';
import { useQueryContext } from '@/contexts/QueryContext';

interface ToolCallingToggleProps {
    label?: string;
    dialogContent?: string;
    tooltipPlacement?: ParameterToggleProps['tooltipPlacement'];
    disabled?: boolean;
}

export const ToolCallingToggle = ({
    label = 'Tool calling',
    dialogContent = TOOL_CALLING_INFO,
    tooltipPlacement = 'left',
    disabled: componentDisabled = false, // component wide disable
}: ToolCallingToggleProps) => {
    const { threadStarted, canCallTools, isToolCallingEnabled, updateIsToolCallingEnabled } =
        useQueryContext();

    const { ToolsDialog, setToolsDialogOpen } = useToolsDialog();

    const canCreateToolDefinitions = !componentDisabled && canCallTools && !threadStarted;
    const canEditToolDefinitions = !componentDisabled && isToolCallingEnabled;

    return (
        <>
            <ParameterToggle
                value={isToolCallingEnabled}
                label={label}
                dialogContent={dialogContent}
                dialogTitle="Tool Calling"
                disableToggle={!canCreateToolDefinitions}
                tooltipPlacement={tooltipPlacement}
                disableEditButton={!canEditToolDefinitions}
                id="tool-calling"
                onEditClick={() => {
                    setToolsDialogOpen(true);
                }}
                onToggleChange={(v) => {
                    updateIsToolCallingEnabled(v);
                }}
            />
            <ToolsDialog />
        </>
    );
};
