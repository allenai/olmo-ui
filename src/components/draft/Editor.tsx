// todo: x

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

import DataChipsPlugin from './DataChipsPlugin';
import { DataChip } from '../../api/DataChip';
import { HtmlPlugin } from './HtmlPlugin';
import { Nodes } from './Nodes';
import FloatingTextFormatToolbarPlugin from './FloatingTextFormatToolbarPlugin';
import { OnKeyDownPlugin } from './OnKeyDownPlugin';
import { ThemeWrapper, theme } from './ThemeWrapper';

function AutoFocusPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        // Focus the editor when the effect fires!
        editor.focus();
    }, [editor]);

    return null;
}

function UpdateEditablePlugin({ isEditable }: { isEditable: boolean }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        editor.setEditable(isEditable);
    }, [isEditable]);

    return null;
}

interface Props {
    chips?: DataChip[];
    disabled?: boolean;
    label?: string;
    initialHtmlString?: string;
    onChange?: (htmlString: string) => void;
    onKeyDown?: (e: KeyboardEvent) => void;
    minRows?: number;
}

export const Editor = ({
    disabled,
    label,
    chips,
    onChange,
    initialHtmlString,
    onKeyDown,
    minRows = 1,
}: Props) => {
    const initialConfig = {
        namespace: 'MyEditor',
        theme,
        onError: (e: Error) => console.error(e),
        nodes: [...Nodes],
        editable: !disabled,
    };

    return (
        <ThemeWrapper>
            <Label>{label}</Label>
            <EditorWrapper minRows={minRows}>
                <LexicalComposer initialConfig={initialConfig}>
                    <RichTextPlugin
                        ErrorBoundary={LexicalErrorBoundary}
                        contentEditable={<ContentEditable className="editor-input" />}
                        placeholder={null}
                    />
                    <OnKeyDownPlugin
                        onKeyDown={(e: KeyboardEvent) => {
                            onKeyDown && onKeyDown(e);
                        }}
                    />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <FloatingTextFormatToolbarPlugin />
                    {chips ? <DataChipsPlugin chips={chips} /> : <></>}
                    <UpdateEditablePlugin isEditable={!disabled} />
                    <HtmlPlugin
                        onHtmlChanged={(html) => onChange && onChange(html)}
                        initialHtml={initialHtmlString}
                        isReadOnly={!initialConfig.editable}
                    />
                </LexicalComposer>
            </EditorWrapper>
        </ThemeWrapper>
    );
};

// styles are matching mui textblock, so not using varnish directly
const EditorWrapper = styled('div')<{ minRows: number }>`
    display: flex;
    flex-flow: column;
    height: 100%;
    // height of a line of text times min number plus margins
    min-height: ${({ minRows }) => minRows * 23.19 + 16 + 16 + 16.5 + 16.5}px;

    .editor-input {
        border: #cbcbcb 1px solid;
        color: ${({ theme }) => theme.color2.N5};
        border-radius: ${({ theme }) => theme.shape.borderRadius}px;
        padding: 16.5px 14px;
        flex: 1 1 auto;
        :hover {
            border-color: ${({ theme }) => theme.color2.N5};
        }
    }
`;

const Label = styled.div`
    color: ${({ theme }) => theme.color2.N4};
`;
