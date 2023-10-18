// see: https://github.com/facebook/lexical/blob/4b4db176bc9a373a33f81f11c0e63dee74a25a20/packages/lexical-playground/src/nodes/MentionNode.ts
// and: https://lexical.dev/docs/concepts/nodes

import React, { ReactNode } from 'react';
import {
    type LexicalNode,
    type NodeKey,
    DecoratorNode,
    DOMConversionMap,
    DOMConversionOutput,
    Spread,
    SerializedLexicalNode,
} from 'lexical';

import { DataChipDisplay } from './DataChipDisplay';
import { DataChip } from '../../../api/DataChip';
import { mockChips } from '../util/mockData';

const dataChipIdAttributeName = 'data-datachip-id';

export type SerializedDataChipNode = Spread<
    {
        chip: DataChip;
    },
    SerializedLexicalNode
>;

const convertDataChipElement = (domNode: HTMLElement): DOMConversionOutput | null => {
    const id = domNode.getAttribute(dataChipIdAttributeName);
    const chips = mockChips.filter((c) => c.id === id);
    if (chips && chips.length) {
        return {
            node: createDataChipNode(chips[0]),
        };
    }
    // chip does not exist...
    return null;
};

// Nodes are items that can be added to a lexical document. This one is for showing datachips.
export class DataChipNode extends DecoratorNode<ReactNode> {
    dataChip: DataChip;

    static getType(): string {
        return 'datachip';
    }

    static clone(node: DataChipNode): DataChipNode {
        return new DataChipNode(node.dataChip, node.__key);
    }

    static importJSON(serializedNode: SerializedDataChipNode): DataChipNode {
        const node = createDataChipNode(serializedNode.chip);
        return node;
    }

    constructor(dataChip: DataChip, key?: NodeKey) {
        super(key);
        this.dataChip = dataChip;
    }

    exportJSON(): SerializedDataChipNode {
        return {
            ...super.exportJSON(),
            chip: this.dataChip,
            type: this.getType(),
            version: 1,
        };
    }

    createDOM(): HTMLElement {
        const el = document.createElement('span');
        el.setAttribute(dataChipIdAttributeName, this.dataChip.id);
        return el;
    }

    updateDOM(): false {
        return false;
    }

    decorate(): ReactNode {
        return <DataChipDisplay chip={this.dataChip} />;
    }

    static importDOM(): DOMConversionMap | null {
        return {
            span: (domNode: HTMLElement) => {
                if (!domNode.hasAttribute(dataChipIdAttributeName)) {
                    return null;
                }
                return {
                    conversion: convertDataChipElement,
                    priority: 1,
                };
            },
        };
    }

    isInline() {
        return true;
    }
}

export const createDataChipNode = (dataChip: DataChip): DataChipNode => {
    return new DataChipNode(dataChip);
};

export const isDataChipNode = (node: LexicalNode | null | undefined): node is DataChipNode => {
    return node instanceof DataChipNode;
};
