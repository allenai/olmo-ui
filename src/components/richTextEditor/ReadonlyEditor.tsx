import React from 'react';
import styled from 'styled-components';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

import { Nodes } from './nodes/Nodes';
import { HtmlPlugin } from './plugins/HtmlPlugin';
import { OnClickPlugin } from './plugins/OnClickPlugin';
import { ThemeWrapper, theme } from './util/ThemeWrapper';
import { FloatingTextFormatToolbarPlugin } from './toolbar/FloatingTextFormatToolbarPlugin';

interface Props {
    value?: string;
    onClick?: (e: MouseEvent) => void;
    maxRows?: number;
}

// readonly version of the editor
export const ReadonlyEditor = ({ value, onClick, maxRows }: Props) => {
    const initialConfig = {
        namespace: 'MyViewer',
        theme,
        onError: (e: Error) => console.error(e),
        nodes: [...Nodes],
        editable: false,
    };

    return (
        <ViewerWrapper maxRows={maxRows}>
            <LexicalComposer initialConfig={initialConfig}>
                <RichTextPlugin
                    ErrorBoundary={LexicalErrorBoundary}
                    contentEditable={<ContentEditable className="editor-input" />}
                    placeholder={null}
                />
                <OnClickPlugin
                    onClick={(e: MouseEvent) => {
                        onClick && onClick(e);
                    }}
                />
                <FloatingTextFormatToolbarPlugin />
                <HtmlPlugin initialHtml={value} />
            </LexicalComposer>
        </ViewerWrapper>
    );
};

const ViewerWrapper = styled(ThemeWrapper)<{ maxRows?: number }>`
    // height of a line of text times max number plus margins
    max-height: ${({ maxRows }) => (maxRows ? `${maxRows * 23.19}px` : undefined)};
    // remove p padding when only showing 1 line
    p {
        ${({ maxRows }) => (maxRows === 1 ? 'margin-top:0' : undefined)};
    }
`;
