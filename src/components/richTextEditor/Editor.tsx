import React from 'react';
import styled from 'styled-components';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

import { DataChipsPlugin } from './plugins/DataChipsPlugin';
import { DataChip } from '../../api/DataChip';
import { HtmlPlugin } from './plugins/HtmlPlugin';
import { Nodes } from './nodes/Nodes';
import { FloatingTextFormatToolbarPlugin } from './toolbar/FloatingTextFormatToolbarPlugin';
import { OnKeyDownPlugin } from './plugins/OnKeyDownPlugin';
import { ThemeWrapper, theme } from './util/ThemeWrapper';
import { UpdateEditablePlugin } from './plugins/UpdateEditablePlugin';

interface Props {
    chips?: DataChip[];
    disabled?: boolean;
    label?: string;
    initialHtmlString?: string;
    onChange?: (htmlString: string) => void;
    onKeyDown?: (e: KeyboardEvent) => void;
    minRows?: number;
}

// Richtext editor
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
                    <FloatingTextFormatToolbarPlugin />
                    {chips ? <DataChipsPlugin chips={chips} /> : <></>}
                    <UpdateEditablePlugin isEditable={!disabled} />
                    <HtmlPlugin
                        onHtmlChanged={(html) => onChange && onChange(html)}
                        initialHtml={initialHtmlString}
                    />
                </LexicalComposer>
            </EditorWrapper>
        </ThemeWrapper>
    );
};

const lineHeight = 23.19;
// styles are matching mui textblock, so not using varnish directly
const EditorWrapper = styled('div')<{ minRows: number }>`
    display: flex;
    flex-flow: column;
    height: 100%;
    // height of a line of text times min rows plus margins
    min-height: calc(
        ${({ minRows }) => minRows * lineHeight}px + ${({ theme }) => theme.spacing(2 * 4)}
    );

    .editor-input {
        border: #cbcbcb 1px solid;
        color: ${({ theme }) => theme.color2.N5};
        border-radius: ${({ theme }) => theme.shape.borderRadius}px;
        padding: ${({ theme }) => theme.spacing(2)} 14px;
        flex: 1 1 auto;
        :hover {
            border-color: ${({ theme }) => theme.color2.N5};
        }
    }
`;

const Label = styled.div`
    color: ${({ theme }) => theme.color2.N4};
`;
