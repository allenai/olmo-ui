import React, { useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { EditorState, RawDraftContentState, convertFromRaw } from 'draft-js';
import DraftJsEditor from '@draft-js-plugins/editor';
import createMentionPlugin from '@draft-js-plugins/mention';
import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar';

import { ChipDisplay } from './ChipDisplay';
import { ChipSuggestions } from './ChipSuggestions';
import { ToolBar } from './Toolbar';

import '@draft-js-plugins/mention/lib/plugin.css';
import '@draft-js-plugins/inline-toolbar/lib/plugin.css';
import { DataChip } from '../../api/DataChip';

interface Props {
    disabled?: boolean;
    placeholder?: string;
    initialRawData?: RawDraftContentState;
    onChange?: (editorState: EditorState) => void;
    chips: DataChip[];
}

export const Editor = ({ disabled, placeholder, initialRawData, onChange, chips }: Props) => {
    const ref = useRef<DraftJsEditor>(null);

    const [editorState, setEditorState] = useState<EditorState>(
        initialRawData
            ? EditorState.createWithContent(convertFromRaw(initialRawData))
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
                    readOnly={disabled}
                    placeholder={placeholder}
                    editorKey={'editor'}
                    editorState={editorState}
                    onChange={(editorState: EditorState) => {
                        setEditorState(editorState);
                        onChange && onChange(editorState);
                    }}
                    plugins={[mentionPlugin, inlineToolbarPlugin]}
                    ref={ref}
                />
                <InlineToolbar>{(externalProps) => <ToolBar {...externalProps} />}</InlineToolbar>
                <ChipSuggestions mentionPlugin={mentionPlugin} chips={chips} />
            </EditorWrapper>
        </OuterContainer>
    );
};

// styles are matching mui textblock, so not using varnish directly
const EditorWrapper = styled.div`
    border: #cbcbcb 1px solid;
    color: ${({ theme }) => theme.color2.N5};
    border-radius: ${({ theme }) => theme.shape.borderRadius};
    padding: 16.5px 14px;
    min-height: 260px;

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
`;
