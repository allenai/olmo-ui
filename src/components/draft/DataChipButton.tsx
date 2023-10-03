import React from 'react';
import { Tooltip } from '@mui/material';
import { ToolbarChildrenProps } from '@draft-js-plugins/inline-toolbar/lib/components/Toolbar';

import DataObjectIcon from '@mui/icons-material/DataObject';

import { CustomButton, CustomButtonWrapper, getTextSelection } from './Toolbar';
import { DataChipEditorButtonWrapper } from '../ModalEditors/DataChipEditorButtonWrapper';

// custom button added to toolbar to add a data chip
export const DataChipButton = (props: ToolbarChildrenProps) => {
    // When using a click event inside overridden content, mouse down
    // events needs to be prevented so the focus stays in the editor
    // and the toolbar remains visible
    const onMouseDown = (event: React.MouseEvent) => event.preventDefault();

    return (
        <DataChipEditorButtonWrapper
            seedContent={getTextSelection(
                props.getEditorState().getCurrentContent(),
                props.getEditorState().getSelection()
            )}
            renderButton={(props) => (
                <CustomButtonWrapper onMouseDown={onMouseDown}>
                    <CustomButton {...props}>
                        <Tooltip title="Generate Data Chip">
                            <DataObjectIcon />
                        </Tooltip>
                    </CustomButton>
                </CustomButtonWrapper>
            )}
        />
    );
};
