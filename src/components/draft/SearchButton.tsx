import React from 'react';
import styled from 'styled-components';
import { SelectionState, ContentState, BlockMap, ContentBlock } from 'draft-js';
import { Tooltip } from '@mui/material';
import { ToolbarChildrenProps } from '@draft-js-plugins/inline-toolbar/lib/components/Toolbar';

import SearchIcon from '@mui/icons-material/Search';

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
            <CustomSearchButton onClick={onClick}>
                <Tooltip title="Search Pretraining Data">
                    <SearchIcon />
                </Tooltip>
            </CustomSearchButton>
        </CustomButtonWrapper>
    );
};

// returns the text content selected currently
const getTextSelection = (
    contentState: ContentState,
    selection: SelectionState,
    blockDelimiter: string = '\n'
) => {
    const startKey = selection.getStartKey();
    const endKey = selection.getEndKey();
    const blocks: BlockMap = contentState.getBlockMap();
    let lastWasEnd = false;
    const selectedBlock = blocks
        .skipUntil((block?: ContentBlock) => {
            return block?.getKey() === startKey;
        })
        .takeUntil((block?: ContentBlock) => {
            const result = lastWasEnd;
            if (block?.getKey() === endKey) {
                lastWasEnd = true;
            }
            return result;
        });
    return selectedBlock
        .map((block?: ContentBlock) => {
            const key = block?.getKey();
            let text = block?.getText() || '';
            let start = 0;
            let end = text.length;
            if (key === startKey) {
                start = selection.getStartOffset();
            }
            if (key === endKey) {
                end = selection.getEndOffset();
            }
            text = text.slice(start, end);
            return text;
        })
        .join(blockDelimiter);
};

const CustomButtonWrapper = styled.div`
    display: inline-block;
`;

// these styles match the styles used by daft.js, so not using varnish theme on purpose
const CustomSearchButton = styled.button`
    background: #fbfbfb;
    color: #888;
    font-size: 18px;
    border: 0;
    padding-top: 5px;
    vertical-align: bottom;
    height: 34px;
    width: 36px;

    :hover,
    :focus {
        background: #f3f3f3;
    }
`;
