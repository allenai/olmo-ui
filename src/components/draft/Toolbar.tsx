import React from 'react';
import styled from 'styled-components';
import { ItalicButton, BoldButton, UnderlineButton, CodeButton } from '@draft-js-plugins/buttons';
import { ToolbarChildrenProps } from '@draft-js-plugins/inline-toolbar/lib/components/Toolbar';
import { BlockMap, ContentBlock, ContentState, SelectionState } from 'draft-js';

import { SearchButton } from './SearchButton';
import { DataChipButton } from './DataChipButton';
import { LogRawButton } from './CopyRawButton';

export const ToolBar = (externalProps: ToolbarChildrenProps) => {
    return (
        <>
            <SearchButton {...externalProps} />
            <DataChipButton {...externalProps} />
            <BoldButton {...externalProps} />
            <ItalicButton {...externalProps} />
            <UnderlineButton {...externalProps} />
            <CodeButton {...externalProps} />
            <LogRawButton {...externalProps} />
        </>
    );
};

export const CustomButtonWrapper = styled.div`
    display: inline-block;
`;

// these styles match the styles used by daft.js, so not using varnish theme on purpose
export const CustomButton = styled.button`
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

// returns the text content selected currently
export const getTextSelection = (
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
