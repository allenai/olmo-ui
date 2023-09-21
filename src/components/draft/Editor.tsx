// todo
// connect to toggle
//   replace existing textareas (wont work from backend response)
//   remove content menu

import React, { useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { EditorState, convertFromRaw } from 'draft-js';
import DraftJsEditor from '@draft-js-plugins/editor';
import createMentionPlugin from '@draft-js-plugins/mention';
import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar';

import { ChipDisplay } from './ChipDisplay';
import { curRawData } from './mockData';
import { MentionSuggestions } from './MentionSuggestions';
import { ToolBar } from './Toolbar';

import '@draft-js-plugins/mention/lib/plugin.css';
import '@draft-js-plugins/inline-toolbar/lib/plugin.css';

export const Editor = () => {
    const ref = useRef<DraftJsEditor>(null);

    const [editorState, setEditorState] = useState(
        curRawData
            ? EditorState.createWithContent(convertFromRaw(curRawData))
            : () => EditorState.createEmpty()
    );

    const { mentionPlugin, inlineToolbarPlugin, InlineToolbar } = useMemo(() => {
        const inlineToolbarPlugin = createInlineToolbarPlugin();
        const mentionPlugin = createMentionPlugin({
            entityMutability: 'IMMUTABLE',
            supportWhitespace: true,
            mentionComponent: ChipDisplay,
        });
        const { InlineToolbar } = inlineToolbarPlugin;
        return { mentionPlugin, inlineToolbarPlugin, InlineToolbar };
    }, []);

    return (
        <OuterContainer
            onClick={() => {
                ref.current?.focus();
            }}>
            <EditorWrapper>
                <DraftJsEditor
                    placeholder="Select a Prompt Template above or type a free form prompt"
                    editorKey={'editor'}
                    editorState={editorState}
                    onChange={setEditorState}
                    plugins={[mentionPlugin, inlineToolbarPlugin]}
                    ref={ref}
                />
                <InlineToolbar>{(externalProps) => <ToolBar {...externalProps} />}</InlineToolbar>
                <MentionSuggestions mentionPlugin={mentionPlugin} />
            </EditorWrapper>
        </OuterContainer>
    );
};

// styles are matching mui textblock, so not using varnish directly
const EditorWrapper = styled.div`
    border: #cbcbcb 1px solid;
    color: ${({ theme }) => theme.color2.N5};
    border-radius: 4px;
    padding: 16.5px 14px;

    .public-DraftEditorPlaceholder-inner {
        color: ${({ theme }) => theme.color2.N3};
    }

    :hover {
        border-color: ${({ theme }) => theme.color2.N5};
    }
`;

const OuterContainer = styled.div`
    background-color: white;
    border-radius: 10px;
    padding: ${({ theme }) => theme.spacing(2)};
`;
