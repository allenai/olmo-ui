import { analyticsClient } from '@/analytics/AnalyticsClient';
import { useAppContext } from '@/AppContext';
import { useQueryContext } from '@/contexts/QueryContext';
import { SnackMessageType } from '@/slices/SnackMessageSlice';

import { ToolDeclarationDialog } from './ToolDeclrationDialog/ToolDeclarationDialog';

export const ToolsDialog = ({
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
        isToolCallingEnabled,
        updateIsToolCallingEnabled,
        updateSelectedTools,
        selectedTools,
    } = useQueryContext();
    const addSnackMessage = useAppContext((state) => state.addSnackMessage);

    return (
        <ToolDeclarationDialog
            jsonData={userToolDefinitions ?? undefined}
            availableTools={availableTools}
            selectedTools={selectedTools}
            isToolCallingEnabled={isToolCallingEnabled}
            isDisabled={threadStarted}
            isOpen={isOpen}
            onClose={handleClose}
            onSave={({ declaration, tools }, toolCallingEnabled) => {
                analyticsClient.trackParametersUpdate({
                    parameterUpdated: 'tool_definitions',
                });
                updateUserToolDefinitions(declaration);
                updateSelectedTools(tools);
                updateIsToolCallingEnabled(toolCallingEnabled);
                addSnackMessage({
                    id: `parameters-saved-${new Date().getTime()}`.toLowerCase(),
                    type: SnackMessageType.Brief,
                    message: 'Tools Saved',
                });
            }}
        />
    );
};
