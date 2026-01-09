import type { Element, ElementContent, Root } from 'hast';

import { TopLevelAttributionSpan } from '@/api/AttributionClient';

export interface AttributionSpan {
    spanKey: string;
    span: TopLevelAttributionSpan;
}

type Parent = Element | Root;

/**
 * Rehype plugin that wraps text spans in attribution-highlight elements at the AST level.
 *
 * This plugin operates on the HTML AST (HAST) after markdown has been parsed. It finds
 * text nodes matching the provided spans and wraps them in custom <attribution-highlight>
 * elements for OlmoTrace highlighting.
 *
 * @param spans - Array of attribution spans to highlight in the content
 * @returns Rehype transformer function
 *
 * @example
 * const spans = [
 *   { spanKey: '0', span: { text: 'Hello world', documents: [123] } }
 * ];
 * rehypePlugins={[[rehypeAttributionHighlights, spans]]}
 */
export function rehypeAttributionHighlights(spans: AttributionSpan[] = []) {
    return (tree: Root) => {
        if (spans.length === 0) {
            return;
        }

        // Track which spans have been applied
        const appliedSpans = new Set<string>();

        function processNode(parent: Parent) {
            if (!('children' in parent)) return;

            for (let i = 0; i < parent.children.length; i++) {
                const node = parent.children[i];

                if (node.type === 'text') {
                    const textNode = node;
                    let remainingText = textNode.value;
                    const newNodes: ElementContent[] = [];

                    // Process each span that hasn't been applied yet
                    for (const { spanKey, span } of spans) {
                        if (appliedSpans.has(spanKey) || !span.text) {
                            continue;
                        }

                        const spanText = span.text;
                        const spanIndex = remainingText.indexOf(spanText);

                        if (spanIndex === -1) {
                            continue;
                        }

                        // Mark this span as applied
                        appliedSpans.add(spanKey);

                        // Text before the match
                        if (spanIndex > 0) {
                            newNodes.push({
                                type: 'text',
                                value: remainingText.slice(0, spanIndex),
                            });
                        }

                        // The matched text wrapped in attribution-highlight
                        newNodes.push({
                            type: 'element',
                            tagName: 'attribution-highlight',
                            properties: {
                                span: spanKey,
                            },
                            children: [
                                {
                                    type: 'text',
                                    value: spanText,
                                },
                            ],
                        });

                        // Continue with text after the match
                        remainingText = remainingText.slice(spanIndex + spanText.length);
                    }

                    // If we made any replacements, update the parent's children
                    if (newNodes.length > 0) {
                        // Add any remaining text
                        if (remainingText) {
                            newNodes.push({
                                type: 'text',
                                value: remainingText,
                            });
                        }

                        // Replace the original text node with the new nodes
                        parent.children.splice(i, 1, ...newNodes);
                        // Adjust index since we added multiple nodes
                        i += newNodes.length - 1;
                    }
                } else if (node.type === 'element') {
                    // Recursively process child elements
                    processNode(node);
                }
            }
        }

        processNode(tree);
    };
}
