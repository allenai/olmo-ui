import { useState } from 'react';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { useAppContext } from '@/AppContext';
import { ParameterToggle } from '@/components/thread/parameter/inputs/ParameterToggle';
import { ToolDeclarationDialog } from '@/components/thread/tools/ToolDeclarationDialog';
import { useQueryContext } from '@/contexts/QueryContext';
import { SnackMessageType } from '@/slices/SnackMessageSlice';

const TOOL_CALLING_INFO =
    'If enabled, this allows you to define functions that the model can call. Use the edit or view button to create or modify the function definitions.';

const ToolsDialog = ({
    isOpen,
    onClose: handleClose,
}: {
    isOpen: boolean;
    onClose?: () => void;
}) => {
    const {
        threadStarted,
        availableTools,
        userToolDefinitions,
        updateUserToolDefinitions,
        updateSelectedTools,
        selectedTools,
    } = useQueryContext();
    const addSnackMessage = useAppContext((state) => state.addSnackMessage);
    return (
        <ToolDeclarationDialog
            jsonData={userToolDefinitions ?? undefined}
            availableTools={availableTools}
            selectedTools={selectedTools}
            isDisabled={threadStarted}
            isOpen={isOpen}
            onClose={handleClose}
            onSave={({ declaration, tools }) => {
                analyticsClient.trackParametersUpdate({
                    parameterUpdated: 'tool_definitions',
                });
                updateUserToolDefinitions(declaration);
                updateSelectedTools(tools);
                addSnackMessage({
                    id: `parameters-saved-${new Date().getTime()}`.toLowerCase(),
                    type: SnackMessageType.Brief,
                    message: 'Tools Saved',
                });
            }}
        />
    );
};

export const ToolCallingToggle = () => {
    const { threadStarted, canCallTools, isToolCallingEnabled, updateIsToolCallingEnabled } =
        useQueryContext();

    const canCreateToolDefinitions = canCallTools && !threadStarted;

    const [shouldShowToolsDialog, setShouldShowToolsDialog] = useState(false);

    const handleClose = () => {
        setShouldShowToolsDialog(false);
    };

    return (
        <>
            <ParameterToggle
                value={isToolCallingEnabled}
                label="Tool calling"
                dialogContent={TOOL_CALLING_INFO}
                dialogTitle="Tool Calling"
                disableToggle={!canCreateToolDefinitions}
                disableEditButton={threadStarted ? false : !isToolCallingEnabled}
                id="tool-calling"
                onEditClick={() => {
                    setShouldShowToolsDialog(true);
                }}
                onToggleChange={(v) => {
                    updateIsToolCallingEnabled(v);
                }}
            />
            <ToolsDialog isOpen={shouldShowToolsDialog} onClose={handleClose} />
        </>
    );
};
