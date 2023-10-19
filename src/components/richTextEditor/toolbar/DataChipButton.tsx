import React from 'react';
import DataObjectIcon from '@mui/icons-material/DataObject';

import { DataChipEditorButtonWrapper } from '../../ModalEditors/DataChipEditorButtonWrapper';
import { ToolbarButton } from './ToolbarButton';

// custom button added to toolbar to add a data chip
export const DataChipButton = ({
    selection,
    className,
}: {
    selection?: string;
    className?: string;
}) => {
    return (
        <DataChipEditorButtonWrapper
            seedContent={selection}
            renderButton={(props) => (
                <ToolbarButton tooltip="Generate Data Chip" {...props} className={className}>
                    <DataObjectIcon />
                </ToolbarButton>
            )}
        />
    );
};
