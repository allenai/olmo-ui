// see: https://github.com/facebook/lexical/blob/2319cad6859720f94998066b80e826dbe7b1a20e/packages/lexical-playground/src/themes/PlaygroundEditorTheme.css
// see: https://github.com/facebook/lexical/blob/2319cad6859720f94998066b80e826dbe7b1a20e/packages/lexical-playground/src/themes/PlaygroundEditorTheme.ts

import styled from 'styled-components';
import type { EditorThemeClasses } from 'lexical';

// theme mapping for classnames in the editor. taken from link above.
export const theme: EditorThemeClasses = {
    blockCursor: 'theme_blockCursor',
    characterLimit: 'theme_characterLimit',
    code: 'theme_code',
    codeHighlight: {
        atrule: 'theme_tokenAttr',
        attr: 'theme_tokenAttr',
        boolean: 'theme_tokenProperty',
        builtin: 'theme_tokenSelector',
        cdata: 'theme_tokenComment',
        char: 'theme_tokenSelector',
        class: 'theme_tokenFunction',
        'class-name': 'theme_tokenFunction',
        comment: 'theme_tokenComment',
        constant: 'theme_tokenProperty',
        deleted: 'theme_tokenProperty',
        doctype: 'theme_tokenComment',
        entity: 'theme_tokenOperator',
        function: 'theme_tokenFunction',
        important: 'theme_tokenVariable',
        inserted: 'theme_tokenSelector',
        keyword: 'theme_tokenAttr',
        namespace: 'theme_tokenVariable',
        number: 'theme_tokenProperty',
        operator: 'theme_tokenOperator',
        prolog: 'theme_tokenComment',
        property: 'theme_tokenProperty',
        punctuation: 'theme_tokenPunctuation',
        regex: 'theme_tokenVariable',
        selector: 'theme_tokenSelector',
        string: 'theme_tokenSelector',
        symbol: 'theme_tokenProperty',
        tag: 'theme_tokenProperty',
        url: 'theme_tokenOperator',
        variable: 'theme_tokenVariable',
    },
    embedBlock: {
        base: 'theme_embedBlock',
        focus: 'theme_embedBlockFocus',
    },
    hashtag: 'theme_hashtag',
    heading: {
        h1: 'theme_h1',
        h2: 'theme_h2',
        h3: 'theme_h3',
        h4: 'theme_h4',
        h5: 'theme_h5',
        h6: 'theme_h6',
    },
    image: 'editor-image',
    indent: 'theme_indent',
    inlineImage: 'inline-editor-image',
    layoutContainer: 'theme_layoutContaner',
    layoutItem: 'theme_layoutItem',
    link: 'theme_link',
    list: {
        listitem: 'theme_listItem',
        listitemChecked: 'theme_listItemChecked',
        listitemUnchecked: 'theme_listItemUnchecked',
        nested: {
            listitem: 'theme_nestedListItem',
        },
        olDepth: ['theme_ol1', 'theme_ol2', 'theme_ol3', 'theme_ol4', 'theme_ol5'],
        ul: 'theme_ul',
    },
    ltr: 'theme_ltr',
    mark: 'theme_mark',
    markOverlap: 'theme_markOverlap',
    paragraph: 'theme_paragraph',
    quote: 'theme_quote',
    rtl: 'theme_rtl',
    table: 'theme_table',
    tableAddColumns: 'theme_tableAddColumns',
    tableAddRows: 'theme_tableAddRows',
    tableCell: 'theme_tableCell',
    tableCellActionButton: 'theme_tableCellActionButton',
    tableCellActionButtonContainer: 'theme_tableCellActionButtonContainer',
    tableCellEditing: 'theme_tableCellEditing',
    tableCellHeader: 'theme_tableCellHeader',
    tableCellPrimarySelected: 'theme_tableCellPrimarySelected',
    tableCellResizer: 'theme_tableCellResizer',
    tableCellSelected: 'theme_tableCellSelected',
    tableCellSortedIndicator: 'theme_tableCellSortedIndicator',
    tableResizeRuler: 'theme_tableCellResizeRuler',
    tableSelected: 'theme_tableSelected',
    tableSelection: 'theme_tableSelection',
    text: {
        bold: 'theme_textBold',
        code: 'theme_textCode',
        italic: 'theme_textItalic',
        strikethrough: 'theme_textStrikethrough',
        subscript: 'theme_textSubscript',
        superscript: 'theme_textSuperscript',
        underline: 'theme_textUnderline',
        underlineStrikethrough: 'theme_textUnderlineStrikethrough',
    },
};

// wrapper to convert classes above to styles
// todo: convert to use varnish in a different pr
export const ThemeWrapper = styled.div`
    .theme_ltr {
        text-align: left;
    }
    .theme_rtl {
        text-align: right;
    }
    .theme_paragraph {
        margin: 0;
        position: relative;
    }
    .theme_quote {
        margin: 0;
        margin-left: 20px;
        margin-bottom: 10px;
        font-size: 15px;
        color: rgb(101, 103, 107);
        border-left-color: rgb(206, 208, 212);
        border-left-width: 4px;
        border-left-style: solid;
        padding-left: 16px;
    }
    .theme_h1 {
        font-size: 24px;
        color: rgb(5, 5, 5);
        font-weight: 400;
        margin: 0;
    }
    .theme_h2 {
        font-size: 15px;
        color: rgb(101, 103, 107);
        font-weight: 700;
        margin: 0;
        text-transform: uppercase;
    }
    .theme_h3 {
        font-size: 12px;
        margin: 0;
        text-transform: uppercase;
    }
    .theme_indent {
        --lexical-indent-base-value: 40px;
    }
    .theme_textBold {
        font-weight: bold;
    }
    .theme_textItalic {
        font-style: italic;
    }
    .theme_textUnderline {
        text-decoration: underline;
    }
    .theme_textStrikethrough {
        text-decoration: line-through;
    }
    .theme_textUnderlineStrikethrough {
        text-decoration: underline line-through;
    }
    .theme_textSubscript {
        font-size: 0.8em;
        vertical-align: sub !important;
    }
    .theme_textSuperscript {
        font-size: 0.8em;
        vertical-align: super;
    }
    .theme_textCode {
        background-color: rgb(240, 242, 245);
        padding: 1px 0.25rem;
        font-family: Menlo, Consolas, Monaco, monospace;
        font-size: 94%;
    }
    .theme_hashtag {
        background-color: rgba(88, 144, 255, 0.15);
        border-bottom: 1px solid rgba(88, 144, 255, 0.3);
    }
    .theme_link {
        color: rgb(33, 111, 219);
        text-decoration: none;
    }
    .theme_link:hover {
        text-decoration: underline;
        cursor: pointer;
    }
    .theme_code {
        background-color: rgb(240, 242, 245);
        font-family: Menlo, Consolas, Monaco, monospace;
        display: block;
        padding: 8px 8px 8px 52px;
        line-height: 1.53;
        font-size: 13px;
        margin: 0;
        margin-top: 8px;
        margin-bottom: 8px;
        overflow-x: auto;
        position: relative;
        tab-size: 2;
    }
    .theme_code:before {
        content: attr(data-gutter);
        position: absolute;
        background-color: #eee;
        left: 0;
        top: 0;
        border-right: 1px solid #ccc;
        padding: 8px;
        color: #777;
        white-space: pre-wrap;
        text-align: right;
        min-width: 25px;
    }
    .theme_table {
        border-collapse: collapse;
        border-spacing: 0;
        overflow-y: scroll;
        overflow-x: scroll;
        table-layout: fixed;
        width: max-content;
        margin: 30px 0;
    }
    .theme_tableSelection *::selection {
        background-color: transparent;
    }
    .theme_tableSelected {
        outline: 2px solid rgb(60, 132, 244);
    }
    .theme_tableCell {
        border: 1px solid #bbb;
        width: 75px;
        min-width: 75px;
        vertical-align: top;
        text-align: start;
        padding: 6px 8px;
        position: relative;
        outline: none;
    }
    .theme_tableCellSortedIndicator {
        display: block;
        opacity: 0.5;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background-color: #999;
    }
    .theme_tableCellResizer {
        position: absolute;
        right: -4px;
        height: 100%;
        width: 8px;
        cursor: ew-resize;
        z-index: 10;
        top: 0;
    }
    .theme_tableCellHeader {
        background-color: #f2f3f5;
        text-align: start;
    }
    .theme_tableCellSelected {
        background-color: #c9dbf0;
    }
    .theme_tableCellPrimarySelected {
        border: 2px solid rgb(60, 132, 244);
        display: block;
        height: calc(100% - 2px);
        position: absolute;
        width: calc(100% - 2px);
        left: -1px;
        top: -1px;
        z-index: 2;
    }
    .theme_tableCellEditing {
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
        border-radius: 3px;
    }
    .theme_tableAddColumns {
        position: absolute;
        top: 0;
        width: 20px;
        background-color: #eee;
        height: 100%;
        right: -25px;
        animation: table-controls 0.2s ease;
        border: 0;
        cursor: pointer;
    }
    .theme_tableAddColumns:after {
        background-image: url(../images/icons/plus.svg);
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        display: block;
        content: ' ';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.4;
    }
    .theme_tableAddColumns:hover {
        background-color: #c9dbf0;
    }
    .theme_tableAddRows {
        position: absolute;
        bottom: -25px;
        width: calc(100% - 25px);
        background-color: #eee;
        height: 20px;
        left: 0;
        animation: table-controls 0.2s ease;
        border: 0;
        cursor: pointer;
    }
    .theme_tableAddRows:after {
        background-image: url(../images/icons/plus.svg);
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        display: block;
        content: ' ';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.4;
    }
    .theme_tableAddRows:hover {
        background-color: #c9dbf0;
    }
    @keyframes table-controls {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
    .theme_tableCellResizeRuler {
        display: block;
        position: absolute;
        width: 1px;
        background-color: rgb(60, 132, 244);
        height: 100%;
        top: 0;
    }
    .theme_tableCellActionButtonContainer {
        display: block;
        right: 5px;
        top: 6px;
        position: absolute;
        z-index: 4;
        width: 20px;
        height: 20px;
    }
    .theme_tableCellActionButton {
        background-color: #eee;
        display: block;
        border: 0;
        border-radius: 20px;
        width: 20px;
        height: 20px;
        color: #222;
        cursor: pointer;
    }
    .theme_tableCellActionButton:hover {
        background-color: #ddd;
    }
    .theme_characterLimit {
        display: inline;
        background-color: #ffbbbb !important;
    }
    .theme_ol1 {
        padding: 0;
        margin: 0;
        list-style-position: inside;
    }
    .theme_ol2 {
        padding: 0;
        margin: 0;
        list-style-type: upper-alpha;
        list-style-position: inside;
    }
    .theme_ol3 {
        padding: 0;
        margin: 0;
        list-style-type: lower-alpha;
        list-style-position: inside;
    }
    .theme_ol4 {
        padding: 0;
        margin: 0;
        list-style-type: upper-roman;
        list-style-position: inside;
    }
    .theme_ol5 {
        padding: 0;
        margin: 0;
        list-style-type: lower-roman;
        list-style-position: inside;
    }
    .theme_ul {
        padding: 0;
        margin: 0;
        list-style-position: inside;
    }
    .theme_listItem {
        margin: 0 32px;
    }
    .theme_listItemChecked,
    .theme_listItemUnchecked {
        position: relative;
        margin-left: 8px;
        margin-right: 8px;
        padding-left: 24px;
        padding-right: 24px;
        list-style-type: none;
        outline: none;
    }
    .theme_listItemChecked {
        text-decoration: line-through;
    }
    .theme_listItemUnchecked:before,
    .theme_listItemChecked:before {
        content: '';
        width: 16px;
        height: 16px;
        top: 2px;
        left: 0;
        cursor: pointer;
        display: block;
        background-size: cover;
        position: absolute;
    }
    .theme_listItemUnchecked[dir='rtl']:before,
    .theme_listItemChecked[dir='rtl']:before {
        left: auto;
        right: 0;
    }
    .theme_listItemUnchecked:focus:before,
    .theme_listItemChecked:focus:before {
        box-shadow: 0 0 0 2px #a6cdfe;
        border-radius: 2px;
    }
    .theme_listItemUnchecked:before {
        border: 1px solid #999;
        border-radius: 2px;
    }
    .theme_listItemChecked:before {
        border: 1px solid rgb(61, 135, 245);
        border-radius: 2px;
        background-color: #3d87f5;
        background-repeat: no-repeat;
    }
    .theme_listItemChecked:after {
        content: '';
        cursor: pointer;
        border-color: #fff;
        border-style: solid;
        position: absolute;
        display: block;
        top: 6px;
        width: 3px;
        left: 7px;
        right: 7px;
        height: 6px;
        transform: rotate(45deg);
        border-width: 0 2px 2px 0;
    }
    .theme_nestedListItem {
        list-style-type: none;
    }
    .theme_nestedListItem:before,
    .theme_nestedListItem:after {
        display: none;
    }
    .theme_tokenComment {
        color: slategray;
    }
    .theme_tokenPunctuation {
        color: #999;
    }
    .theme_tokenProperty {
        color: #905;
    }
    .theme_tokenSelector {
        color: #690;
    }
    .theme_tokenOperator {
        color: #9a6e3a;
    }
    .theme_tokenAttr {
        color: #07a;
    }
    .theme_tokenVariable {
        color: #e90;
    }
    .theme_tokenFunction {
        color: #dd4a68;
    }
    .theme_mark {
        background: rgba(255, 212, 0, 0.14);
        border-bottom: 2px solid rgba(255, 212, 0, 0.3);
        padding-bottom: 2px;
    }
    .theme_markOverlap {
        background: rgba(255, 212, 0, 0.3);
        border-bottom: 2px solid rgba(255, 212, 0, 0.7);
    }
    .theme_mark.selected {
        background: rgba(255, 212, 0, 0.5);
        border-bottom: 2px solid rgba(255, 212, 0, 1);
    }
    .theme_markOverlap.selected {
        background: rgba(255, 212, 0, 0.7);
        border-bottom: 2px solid rgba(255, 212, 0, 0.7);
    }
    .theme_embedBlock {
        user-select: none;
    }
    .theme_embedBlockFocus {
        outline: 2px solid rgb(60, 132, 244);
    }
    .theme_layoutContaner {
        display: grid;
        gap: 10px;
        margin: 10px 0;
    }
    .theme_layoutItem {
        border: 1px dashed #ddd;
        padding: 8px 16px;
    }
`;
