import { useState } from 'react';

import { ToolsDialog } from './ToolsDialog';

export const useToolsDialog = () => {
    const [isToolsDialogOpen, setToolsDialogOpen] = useState(false);

    const handleClose = () => {
        setToolsDialogOpen(false);
    };

    const WrappedToolsDialog = () => {
        return <ToolsDialog isOpen={isToolsDialogOpen} onClose={handleClose} />;
    };

    return {
        isToolsDialogOpen,
        setToolsDialogOpen,
        ToolsDialog: WrappedToolsDialog,
    };
};
