import React from 'react';
import { Tooltip } from '@mui/material';
import { ToolbarChildrenProps } from '@draft-js-plugins/inline-toolbar/lib/components/Toolbar';

import SearchIcon from '@mui/icons-material/Search';

import { CustomButton, CustomButtonWrapper, getTextSelection } from './Toolbar';

// custom button added to toolbar to search the pretraining data
export const SearchButton = (props: ToolbarChildrenProps) => {
    // When using a click event inside overridden content, mouse down
    // events needs to be prevented so the focus stays in the editor
    // and the toolbar remains visible
    const onMouseDown = (event: React.MouseEvent) => event.preventDefault();

    const onClick = () => {
        // Get block for current selection
        let selectedText = getTextSelection(
            props.getEditorState().getCurrentContent(),
            props.getEditorState().getSelection()
        );
        const params = new URLSearchParams();
        selectedText = selectedText.replace(/"/g, '\\"');
        if (selectedText.indexOf(' ') !== -1) {
            selectedText = `"${selectedText}"`;
        }
        params.set('query', selectedText);
        window.location.href = `/search?${params}`;
    };

    return (
        <CustomButtonWrapper onMouseDown={onMouseDown}>
            <CustomButton onClick={onClick}>
                <Tooltip title="Search Pretraining Data">
                    <SearchIcon />
                </Tooltip>
            </CustomButton>
        </CustomButtonWrapper>
    );
};
