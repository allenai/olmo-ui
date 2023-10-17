// see: https://github.com/facebook/lexical/blob/4b4db176bc9a373a33f81f11c0e63dee74a25a20/packages/lexical-playground/src/utils/getSelectedNode.ts

import { $isAtNodeEnd } from '@lexical/selection';
import { ElementNode, RangeSelection, TextNode } from 'lexical';

// util function taken from link above
export const getSelectedNode = (selection: RangeSelection): TextNode | ElementNode => {
    const anchor = selection.anchor;
    const focus = selection.focus;
    const anchorNode = selection.anchor.getNode();
    const focusNode = selection.focus.getNode();
    if (anchorNode === focusNode) {
        return anchorNode;
    }
    const isBackward = selection.isBackward();
    if (isBackward) {
        return $isAtNodeEnd(focus) ? anchorNode : focusNode;
    } else {
        return $isAtNodeEnd(anchor) ? anchorNode : focusNode;
    }
};
