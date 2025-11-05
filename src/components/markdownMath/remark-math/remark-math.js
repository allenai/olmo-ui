// From
// https://github.com/remarkjs/remark-math/blob/e7d0c0257f55843e7477debb76a6a846c9ee06de/packages/remark-math/lib/index.js
// but using local version of micromark-extensions-math
/**
 * @import {Root} from 'mdast'
 * @import {Options} from 'remark-math'
 * @import {} from 'remark-parse'
 * @import {} from 'remark-stringify'
 * @import {Processor} from 'unified'
 */
import { mathFromMarkdown, mathToMarkdown } from 'mdast-util-math';

import { math } from '../micromark-extension-math';

/** @type {Readonly<Options>} */
const emptyOptions = {};

/**
 * Add support for math.
 *
 * @param {Readonly<Options> | null | undefined} [options]
 *   Configuration (optional).
 * @returns {undefined}
 *   Nothing.
 */
export default function remarkMath(options) {
    // @ts-expect-error `this`` is set by unfied
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-this-alias
    const self = /** @type {Processor<Root>} */ (this);
    const settings = options || emptyOptions;
    const data = self.data();

    const micromarkExtensions = data.micromarkExtensions || (data.micromarkExtensions = []);
    const fromMarkdownExtensions =
        data.fromMarkdownExtensions || (data.fromMarkdownExtensions = []);
    const toMarkdownExtensions = data.toMarkdownExtensions || (data.toMarkdownExtensions = []);

    micromarkExtensions.push(math(settings));
    fromMarkdownExtensions.push(mathFromMarkdown());
    toMarkdownExtensions.push(mathToMarkdown(settings));
}
