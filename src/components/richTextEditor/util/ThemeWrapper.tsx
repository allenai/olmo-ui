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
// roughly matched varnish, but we could do more/less as needed
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
        margin-left: ${({ theme }) => theme.spacing(2.5)};
        margin-bottom: ${({ theme }) => theme.spacing(1.5)};
        font-size: ${({ theme }) => theme.spacing(2)};
        color:${({ theme }) => theme.color2.N4};
        border-left-color: ${({ theme }) => theme.color2.P1};
        border-left-width: ${({ theme }) => theme.spacing(0.5)};
        border-left-style: solid;
        padding-left: ${({ theme }) => theme.spacing(2)};
    }
    .theme_h1 {
        font-size: ${({ theme }) => theme.typography.h1.fontSize};
        color: ${({ theme }) => theme.typography.h1.color};
        font-weight: ${({ theme }) => theme.typography.h1.fontWeight};
        margin: 0;
    }
    .theme_h2 {
        font-size: ${({ theme }) => theme.typography.h2.fontSize};
        color: ${({ theme }) => theme.typography.h2.color};
        font-weight: ${({ theme }) => theme.typography.h2.fontWeight};
        margin: 0;
    }
    .theme_h3 {
        font-size: ${({ theme }) => theme.typography.h3.fontSize};
        color: ${({ theme }) => theme.typography.h3.color};
        font-weight: ${({ theme }) => theme.typography.h3.fontWeight};
        margin: 0;
    }
    .theme_indent {
        --lexical-indent-base-value: ${({ theme }) => theme.spacing(5)};
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
        background-color: ${({ theme }) => theme.color2.B1};
        padding: 1px 0.25rem;
        font-family: 'Roboto Mono',SFMono-Regular,Consolas,'Liberation Mono',Menlo,Courier,monospace;
        font-size: 94%;
    }
    .theme_hashtag {
        background-color:  ${({ theme }) => theme.color2.B2};
        border-bottom: 1px solid  ${({ theme }) => theme.color2.B3};
    }
    .theme_link {
        color: ${({ theme }) => theme.color2.B3};
        text-decoration: none;
    }
    .theme_link:hover {
        text-decoration: underline;
        cursor: pointer;
    }
    .theme_code {
        background-color:  ${({ theme }) => theme.color2.B1};
        font-family: 'Roboto Mono',SFMono-Regular,Consolas,'Liberation Mono',Menlo,Courier,monospace;
        display: block;
        padding: ${({ theme }) =>
            `${theme.spacing(1)} ${theme.spacing(1)} ${theme.spacing(1)} 52px`};
        line-height: 1.53;
        font-size: ${({ theme }) => theme.spacing(2)};
        margin: 0;
        margin-top: ${({ theme }) => theme.spacing(1)};
        margin-bottom: ${({ theme }) => theme.spacing(1)};
        overflow-x: auto;
        position: relative;
        tab-size: 2;
    }
    .theme_code:before {
        content: attr(data-gutter);
        position: absolute;
        background-color:  ${({ theme }) => theme.color2.P1};
        left: 0;
        top: 0;
        border-right: 1px solid  ${({ theme }) => theme.color2.N3};
        padding: ${({ theme }) => theme.spacing(1)};
        color:  ${({ theme }) => theme.color2.N4};
        white-space: pre-wrap;
        text-align: right;
        min-width: ${({ theme }) => theme.spacing(3.5)};
        height: 100%;
    }
    .theme_table {
        border-collapse: collapse;
        border-spacing: 0;
        overflow-y: scroll;
        overflow-x: scroll;
        table-layout: fixed;
        width: max-content;
        margin: ${({ theme }) => theme.spacing(4)}; 0;
    }
    .theme_tableSelection *::selection {
        background-color: transparent;
    }
    .theme_tableSelected {
        outline: 2px solid  ${({ theme }) => theme.color2.B3};
    }
    .theme_tableCell {
        border: 1px solid  ${({ theme }) => theme.color2.N3};
        width: ${({ theme }) => theme.spacing(9.5)};
        min-width: ${({ theme }) => theme.spacing(9.5)};
        vertical-align: top;
        text-align: start;
        padding: ${({ theme }) => theme.spacing(1)};
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
        height: ${({ theme }) => theme.spacing(0.5)};
        background-color:  ${({ theme }) => theme.color2.N3};
    }
    .theme_tableCellResizer {
        position: absolute;
        right: -${({ theme }) => theme.spacing(0.5)};
        height: 100%;
        width: ${({ theme }) => theme.spacing(1)};
        cursor: ew-resize;
        z-index: 10;
        top: 0;
    }
    .theme_tableCellHeader {
        background-color:  ${({ theme }) => theme.color2.B1};
        text-align: start;
    }
    .theme_tableCellSelected {
        background-color:  ${({ theme }) => theme.color2.P1};
    }
    .theme_tableCellPrimarySelected {
        border: 2px solid  ${({ theme }) => theme.color2.B3};
        display: block;
        height: calc(100% - 2px);
        position: absolute;
        width: calc(100% - 2px);
        left: -1px;
        top: -1px;
        z-index: 2;
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
        margin: 0 ${({ theme }) => theme.spacing(4)};
    }
    .theme_listItemChecked,
    .theme_listItemUnchecked {
        position: relative;
        margin-left: ${({ theme }) => theme.spacing(1)};
        margin-right: ${({ theme }) => theme.spacing(1)};
        padding-left: ${({ theme }) => theme.spacing(3)};
        padding-right: ${({ theme }) => theme.spacing(3)};
        list-style-type: none;
        outline: none;
    }
    .theme_listItemChecked {
        text-decoration: line-through;
    }
    .theme_listItemUnchecked:before,
    .theme_listItemChecked:before {
        content: '';
        width: ${({ theme }) => theme.spacing(2)};
        height: ${({ theme }) => theme.spacing(2)};
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
        box-shadow: 0 0 0 2px  ${({ theme }) => theme.color2.T2};
        border-radius: 2px;
    }
    .theme_listItemUnchecked:before {
        border: 1px solid  ${({ theme }) => theme.color2.N3};
        border-radius: 2px;
    }
    .theme_listItemChecked:before {
        border: 1px solid  ${({ theme }) => theme.color2.B3};
        border-radius: 2px;
        background-color:  ${({ theme }) => theme.color2.B3};
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
        color:  ${({ theme }) => theme.color2.N4};
    }
    .theme_tokenPunctuation {
        color:  ${({ theme }) => theme.color2.N3};
    }
    .theme_tokenProperty {
        color:  ${({ theme }) => theme.color2.R5};
    }
    .theme_tokenSelector {
        color: ${({ theme }) => theme.color2.G5};
    }
    .theme_tokenOperator {
        color:${({ theme }) => theme.color2.O5};
    }
    .theme_tokenAttr {
        color: ${({ theme }) => theme.color2.T4};
    }
    .theme_tokenVariable {
        color: ${({ theme }) => theme.color2.O4};
    }
    .theme_tokenFunction {
        color: ${({ theme }) => theme.color2.R4};
    }
    .theme_mark {
        background: ${({ theme }) => theme.color2.O3};
        border-bottom: 2px solid ${({ theme }) => theme.color2.O4};
        padding-bottom: 2px;
    }
    .theme_markOverlap {
        background: ${({ theme }) => theme.color2.O4};
        border-bottom: 2px solid ${({ theme }) => theme.color2.O4};
    }
    .theme_mark.selected {
        background: ${({ theme }) => theme.color2.O4};
        border-bottom: 2px solid ${({ theme }) => theme.color2.O5};
    }
    .theme_markOverlap.selected {
        background: ${({ theme }) => theme.color2.O4};
        border-bottom: 2px solid ${({ theme }) => theme.color2.O4};
    }
    .theme_embedBlock {
        user-select: none;
    }
    .theme_embedBlockFocus {
        outline: 2px solid ${({ theme }) => theme.color2.B3};
    }
    .theme_layoutContaner {
        display: grid;
        gap: ${({ theme }) => theme.spacing(1.5)};
        margin: ${({ theme }) => theme.spacing(1.5)}; 0;
    }
    .theme_layoutItem {
        border: 1px dashed #ddd;
        padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(2)}`};
    }
`;
