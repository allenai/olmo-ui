import type { Parent, Root } from 'mdast';
import type { Node } from 'unist';
/**
 * Remark plugin that converts HTML nodes to text nodes.
 *
 * By default, markdown parsers create 'html' nodes when they encounter HTML syntax.
 * This plugin converts those nodes to 'text' nodes so the HTML displays literally
 * instead of being rendered.
 *
 * Example: `<b>hello</b>` becomes literal text "<b>hello</b>" instead of bold "hello"
 */
export function remarkHtmlToText() {
    return (tree: Root) => {
        function processNode(node: Node) {
            // Convert html nodes to text nodes
            if (node.type === 'html') {
                node.type = 'text';
                // node.value already contains the HTML string, keep it as-is
            }

            // Recursively process children
            if ('children' in node && Array.isArray((node as Parent).children)) {
                (node as Parent).children.forEach(processNode);
            }
        }

        tree.children.forEach(processNode);
    };
}
