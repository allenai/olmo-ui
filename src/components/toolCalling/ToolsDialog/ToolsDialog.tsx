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
