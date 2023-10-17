// see: https://github.com/facebook/lexical/blob/4b4db176bc9a373a33f81f11c0e63dee74a25a20/packages/lexical-playground/src/nodes/MentionNode.ts
// and: https://lexical.dev/docs/concepts/nodes

// todo: x

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
import { DataChip } from '../../api/DataChip';
import { mockChips } from './mockData';

export type SerializedDataChipNode = Spread<
    {
        chip: DataChip;
    },
    SerializedLexicalNode
>;

function convertDataChipElement(domNode: HTMLElement): DOMConversionOutput | null {
    const id = domNode.getAttribute('datachip-id');
    const chips = mockChips.filter((c) => c.id === id);
    if (chips && chips.length) {
        return {
            node: $createDataChipNode(chips[0]),
        };
    }
    return null;
}

export class DataChipNode extends DecoratorNode<ReactNode> {
    __dataChip: DataChip;

    static getType(): string {
        return 'datachip';
    }

    static clone(node: DataChipNode): DataChipNode {
        return new DataChipNode(node.__dataChip, node.__key);
    }

    static importJSON(serializedNode: SerializedDataChipNode): DataChipNode {
        const node = $createDataChipNode(serializedNode.chip);
        return node;
    }

    constructor(dataChip: DataChip, key?: NodeKey) {
        super(key);
        this.__dataChip = dataChip;
    }

    exportJSON(): SerializedDataChipNode {
        return {
            ...super.exportJSON(),
            chip: this.__dataChip,
            type: this.getType(),
            version: 1,
        };
    }

    createDOM(): HTMLElement {
        const el = document.createElement('span');
        el.setAttribute('datachip-id', this.__dataChip.id);
        return el;
    }

    updateDOM(): false {
        return false;
    }

    decorate(): ReactNode {
        return <DataChipDisplay chip={this.__dataChip} />;
    }

    static importDOM(): DOMConversionMap | null {
        return {
            span: (domNode: HTMLElement) => {
                if (!domNode.hasAttribute('datachip-id')) {
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

export function $createDataChipNode(dataChip: DataChip): DataChipNode {
    return new DataChipNode(dataChip);
}

export function $isDataChipNode(node: LexicalNode | null | undefined): node is DataChipNode {
    return node instanceof DataChipNode;
}
