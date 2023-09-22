import React from 'react';
import { Tooltip } from '@mui/material';
import { ToolbarChildrenProps } from '@draft-js-plugins/inline-toolbar/lib/components/Toolbar';
import { convertToRaw } from 'draft-js';

import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

import { CustomButton, CustomButtonWrapper } from './Toolbar';

export const LogRawButton = (props: ToolbarChildrenProps) => {
    // When using a click event inside overridden content, mouse down
    // events needs to be prevented so the focus stays in the editor
    // and the toolbar remains visible
    const onMouseDown = (event: React.MouseEvent) => {
        event.preventDefault();
    };

    const onClick = () => {
        navigator.clipboard.writeText(
            JSON.stringify(convertToRaw(props.getEditorState().getCurrentContent()), null, 4)
        );
    };

    return (
        <CustomButtonWrapper onMouseDown={onMouseDown}>
            <CustomButton onClick={onClick}>
                <Tooltip title="Copy raw data to clipboard">
                    <LibraryBooksIcon />
                </Tooltip>
            </CustomButton>
        </CustomButtonWrapper>
    );
};
