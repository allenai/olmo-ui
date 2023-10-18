import * as React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { $isCodeHighlightNode } from '@lexical/code';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
    $getSelection,
    $isParagraphNode,
    $isRangeSelection,
    $isTextNode,
    COMMAND_PRIORITY_LOW,
    FORMAT_TEXT_COMMAND,
    LexicalEditor,
    SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { useCallback, useEffect, useRef, useState } from 'react';

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import SubscriptIcon from '@mui/icons-material/Subscript';
import SuperscriptIcon from '@mui/icons-material/Superscript';
import CodeIcon from '@mui/icons-material/Code';

import { getDOMRangeRect } from '../util/getDOMRangeRect';
import { setFloatingElemPosition } from '../util/setFloatingElemPosition';
import { getSelectedNode } from '../util/getSelectedNode';
import { DataChipButton } from './DataChipButton';
import { SearchButton } from './SearchButton';
import { ToolbarButton } from './ToolbarButton';

// display a popup toolbar for editing text
const TextFormatFloatingToolbar = ({
    editor,
    anchorElem,
    isBold,
    isItalic,
    isUnderline,
    isCode,
    isStrikethrough,
    isSubscript,
    isSuperscript,
}: {
    editor: LexicalEditor;
    anchorElem: HTMLElement;
    isBold: boolean;
    isCode: boolean;
    isItalic: boolean;
    isStrikethrough: boolean;
    isSubscript: boolean;
    isSuperscript: boolean;
    isUnderline: boolean;
}): JSX.Element => {
    const popupCharStylesEditorRef = useRef<HTMLDivElement | null>(null);

    const [selectedText, setSelectedText] = useState<string>();

    const mouseMoveListener = (e: MouseEvent) => {
        if (popupCharStylesEditorRef?.current && (e.buttons === 1 || e.buttons === 3)) {
            if (popupCharStylesEditorRef.current.style.pointerEvents !== 'none') {
                const x = e.clientX;
                const y = e.clientY;
                const elementUnderMouse = document.elementFromPoint(x, y);

                if (!popupCharStylesEditorRef.current.contains(elementUnderMouse)) {
                    // Mouse is not over the target element => not a normal click, but probably a drag
                    popupCharStylesEditorRef.current.style.pointerEvents = 'none';
                }
            }
        }
    };
    const mouseUpListener = (_e: MouseEvent) => {
        if (popupCharStylesEditorRef?.current) {
            if (popupCharStylesEditorRef.current.style.pointerEvents !== 'auto') {
                popupCharStylesEditorRef.current.style.pointerEvents = 'auto';
            }
        }
    };

    useEffect(() => {
        if (popupCharStylesEditorRef?.current) {
            document.addEventListener('mousemove', mouseMoveListener);
            document.addEventListener('mouseup', mouseUpListener);

            return () => {
                document.removeEventListener('mousemove', mouseMoveListener);
                document.removeEventListener('mouseup', mouseUpListener);
            };
        }
    }, [popupCharStylesEditorRef]);

    const updateTextFormatFloatingToolbar = useCallback(() => {
        const selection = $getSelection();

        const popupCharStylesEditorElem = popupCharStylesEditorRef.current;
        const nativeSelection = window.getSelection();

        if (popupCharStylesEditorElem === null) {
            return;
        }

        const rootElement = editor.getRootElement();
        if (
            selection !== null &&
            nativeSelection !== null &&
            !nativeSelection.isCollapsed &&
            rootElement !== null &&
            rootElement.contains(nativeSelection.anchorNode)
        ) {
            const rangeRect = getDOMRangeRect(nativeSelection, rootElement);

            setFloatingElemPosition(rangeRect, popupCharStylesEditorElem, anchorElem);
            setSelectedText(selection.getTextContent());
        }
    }, [editor, anchorElem]);

    useEffect(() => {
        const scrollerElem = anchorElem.parentElement;

        const update = () => {
            editor.getEditorState().read(() => {
                updateTextFormatFloatingToolbar();
            });
        };

        window.addEventListener('resize', update);
        if (scrollerElem) {
            scrollerElem.addEventListener('scroll', update);
        }

        return () => {
            window.removeEventListener('resize', update);
            if (scrollerElem) {
                scrollerElem.removeEventListener('scroll', update);
            }
        };
    }, [editor, updateTextFormatFloatingToolbar, anchorElem]);

    useEffect(() => {
        editor.getEditorState().read(() => {
            updateTextFormatFloatingToolbar();
        });
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    updateTextFormatFloatingToolbar();
                });
            }),

            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    updateTextFormatFloatingToolbar();
                    return false;
                },
                COMMAND_PRIORITY_LOW
            )
        );
    }, [editor, updateTextFormatFloatingToolbar]);

    return (
        <FloatingTextFormatPopup ref={popupCharStylesEditorRef}>
            {editor.isEditable() && (
                <>
                    <ToolbarButton
                        tooltip="Bold"
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                        }}
                        className={isBold ? 'active' : ''}
                        aria-label="Format text as bold">
                        <FormatBoldIcon />
                    </ToolbarButton>
                    <ToolbarButton
                        tooltip="Italic"
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
                        }}
                        className={isItalic ? 'active' : ''}
                        aria-label="Format text as italics">
                        <FormatItalicIcon />
                    </ToolbarButton>
                    <ToolbarButton
                        tooltip="Underline"
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
                        }}
                        className={isUnderline ? 'active' : ''}
                        aria-label="Format text to underlined">
                        <FormatUnderlinedIcon />
                    </ToolbarButton>
                    <ToolbarButton
                        tooltip="Bold"
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
                        }}
                        className={isStrikethrough ? 'active' : ''}
                        aria-label="Format text with a strikethrough">
                        <StrikethroughSIcon />
                    </ToolbarButton>
                    <ToolbarButton
                        tooltip="Subscript"
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
                        }}
                        className={isSubscript ? 'active' : ''}
                        title="Subscript"
                        aria-label="Format Subscript">
                        <SubscriptIcon />
                    </ToolbarButton>
                    <ToolbarButton
                        tooltip="Superscript"
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
                        }}
                        className={isSuperscript ? 'active' : ''}
                        title="Superscript"
                        aria-label="Format Superscript">
                        <SuperscriptIcon />
                    </ToolbarButton>
                    <ToolbarButton
                        tooltip="Code"
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
                        }}
                        className={isCode ? 'active' : ''}
                        aria-label="Insert code block">
                        <CodeIcon />
                    </ToolbarButton>
                </>
            )}
            <DataChipButton selection={selectedText} aria-label="Generate Data Chip" />
            <SearchButton selection={selectedText} aria-label="Search Pretraining Data" />
        </FloatingTextFormatPopup>
    );
};

const useFloatingTextFormatToolbar = (
    editor: LexicalEditor,
    anchorElem: HTMLElement
): JSX.Element | null => {
    const [isText, setIsText] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const [isSubscript, setIsSubscript] = useState(false);
    const [isSuperscript, setIsSuperscript] = useState(false);
    const [isCode, setIsCode] = useState(false);

    const updatePopup = useCallback(() => {
        editor.getEditorState().read(() => {
            // Should not to pop up the floating toolbar when using IME input
            if (editor.isComposing()) {
                return;
            }
            const selection = $getSelection();
            const nativeSelection = window.getSelection();
            const rootElement = editor.getRootElement();

            if (
                nativeSelection !== null &&
                (!$isRangeSelection(selection) ||
                    rootElement === null ||
                    !rootElement.contains(nativeSelection.anchorNode))
            ) {
                setIsText(false);
                return;
            }

            if (!$isRangeSelection(selection)) {
                return;
            }

            const node = getSelectedNode(selection);

            // Update text format
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));
            setIsSubscript(selection.hasFormat('subscript'));
            setIsSuperscript(selection.hasFormat('superscript'));
            setIsCode(selection.hasFormat('code'));

            if (
                !$isCodeHighlightNode(selection.anchor.getNode()) &&
                selection.getTextContent() !== ''
            ) {
                setIsText($isTextNode(node) || $isParagraphNode(node));
            } else {
                setIsText(false);
            }

            const rawTextContent = selection.getTextContent().replace(/\n/g, '');
            if (!selection.isCollapsed() && rawTextContent === '') {
                setIsText(false);
            }
        });
    }, [editor]);

    useEffect(() => {
        document.addEventListener('selectionchange', updatePopup);
        return () => {
            document.removeEventListener('selectionchange', updatePopup);
        };
    }, [updatePopup]);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(() => {
                updatePopup();
            }),
            editor.registerRootListener(() => {
                if (editor.getRootElement() === null) {
                    setIsText(false);
                }
            })
        );
    }, [editor, updatePopup]);

    if (!isText) {
        return null;
    }

    return createPortal(
        <TextFormatFloatingToolbar
            editor={editor}
            anchorElem={anchorElem}
            isBold={isBold}
            isItalic={isItalic}
            isStrikethrough={isStrikethrough}
            isSubscript={isSubscript}
            isSuperscript={isSuperscript}
            isUnderline={isUnderline}
            isCode={isCode}
        />,
        anchorElem
    );
};

export const FloatingTextFormatToolbarPlugin = ({
    anchorElem = document.body,
}: {
    anchorElem?: HTMLElement;
}): JSX.Element | null => {
    const [editor] = useLexicalComposerContext();
    return useFloatingTextFormatToolbar(editor, anchorElem);
};

const FloatingTextFormatPopup = styled.div`
    display: flex;
    background: ${({ theme }) => theme.color2.N1};
    padding: ${({ theme }) => theme.spacing(0.5)};
    vertical-align: middle;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    opacity: 0;
    // match mui
    box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 5px -3px, rgba(0, 0, 0, 0.14) 0px 8px 10px 1px,
        rgba(0, 0, 0, 0.12) 0px 3px 14px 2px;
    border-radius: ${({ theme }) => theme.spacing(0.5)};
    transition: opacity 0.5s;
    height: 35px;
    will-change: transform;
`;
