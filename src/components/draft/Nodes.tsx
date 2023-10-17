// see: https://github.com/facebook/lexical/blob/4b4db176bc9a373a33f81f11c0e63dee74a25a20/packages/lexical-playground/src/nodes/PlaygroundNodes.ts

import type { Klass, LexicalNode } from 'lexical';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { HashtagNode } from '@lexical/hashtag';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { MarkNode } from '@lexical/mark';
import { OverflowNode } from '@lexical/overflow';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';

import { DataChipNode } from './DataChipNode';

// list of nodes the editor can pull from
// lexical takes html string and replaces using items from this list
// these items are styled using the theme
export const Nodes: Array<Klass<LexicalNode>> = [
    DataChipNode,
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    HashtagNode,
    CodeHighlightNode,
    AutoLinkNode,
    LinkNode,
    OverflowNode,
    HorizontalRuleNode,
    MarkNode,
];
