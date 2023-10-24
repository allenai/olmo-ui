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

const dataChipIdAttributeName = 'data-datachip-id';

export type SerializedDataChipNode = Spread<
    {
        chipId: string;
    },
    SerializedLexicalNode
>;

const convertDataChipElement = (domNode: HTMLElement): DOMConversionOutput | null => {
    const chipId = domNode.getAttribute(dataChipIdAttributeName);
    if (!chipId) {
        return null;
    }
    return {
        node: createDataChipNode(chipId),
    };
};

// Nodes are items that can be added to a lexical document. This one is for showing datachips.
export class DataChipNode extends DecoratorNode<ReactNode> {
    chipId: string;

    static getType(): string {
        return 'datachip';
    }

    static clone(node: DataChipNode): DataChipNode {
        return new DataChipNode(node.chipId, node.__key);
    }

    static importJSON(serializedNode: SerializedDataChipNode): DataChipNode {
        const node = createDataChipNode(serializedNode.chipId);
        return node;
    }

    constructor(chipId: string, key?: NodeKey) {
        super(key);
        this.chipId = chipId;
    }

    exportJSON(): SerializedDataChipNode {
        return {
            ...super.exportJSON(),
            chipId: this.chipId,
            type: this.getType(),
            version: 1,
        };
    }

    createDOM(): HTMLElement {
        const el = document.createElement('span');
        el.setAttribute(dataChipIdAttributeName, this.chipId);
        return el;
    }

    updateDOM(): false {
        return false;
    }

    decorate(): ReactNode {
        return <DataChipDisplay chipId={this.chipId} />;
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

export const createDataChipNode = (chipId: string): DataChipNode => {
    return new DataChipNode(chipId);
};

export const isDataChipNode = (node: LexicalNode | null | undefined): node is DataChipNode => {
    return node instanceof DataChipNode;
};
