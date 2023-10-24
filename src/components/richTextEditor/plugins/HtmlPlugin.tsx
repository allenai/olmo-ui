// see: https://stackoverflow.com/questions/73079026/how-we-can-get-html-from-editorstate-in-lexical-rich-editor

import React, { useEffect } from 'react';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $getRoot, CLEAR_HISTORY_COMMAND, $createParagraphNode } from 'lexical';

interface Props {
    initialHtml?: string;
    onHtmlChanged?: (html: string) => void;
}

// converts text to html and back to allow saving to an external database
export const HtmlPlugin = ({ initialHtml, onHtmlChanged }: Props) => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (initialHtml) {
            editor.update(() => {
                $getRoot().clear();
                const parser = new DOMParser();
                const dom = parser.parseFromString(initialHtml, 'text/html');
                const nodes = $generateNodesFromDOM(editor, dom);

                // fixes crazy issue where we cannot add text elements to the root
                const validNodesToInsert = nodes.map((node) => {
                    const paragraphNode = $createParagraphNode();
                    if (node.getType() === 'text') {
                        paragraphNode.append(node);
                        return paragraphNode;
                    } else {
                        return node;
                    }
                });

                $getRoot().append(...validNodesToInsert);
                editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
            });
        }
    }, [initialHtml]);

    return (
        <OnChangePlugin
            onChange={(editorState) => {
                editorState.read(() => {
                    onHtmlChanged && onHtmlChanged($generateHtmlFromNodes(editor));
                });
            }}
        />
    );
};
