/**
 * A TransformStream that yields JSON objects from a stream of newline delimited JSON objects.
 */
export class ReadableJSONLStream<TOutput> extends TransformStream<Uint8Array, TOutput> {
    constructor(encoding: string = 'utf-8') {
        // The tail of the buffer that has not yet been parsed.
        let tail = '';

        // A decoder that converts binary to text.
        const decoder = new TextDecoder(encoding);
        super({
            transform(chunk, controller) {
                // Prefix the decoded chunk with previously buffered text.
                const text = tail + decoder.decode(chunk, { stream: true });
                tail = '';

                // Iterate through the content, character by character.
                let buffer = '';
                for (const c of text) {
                    // Messages are newline delimited. Escaped newlines will not match this clause.
                    // Parse, yield and reset the buffer.
                    if (c === '\n') {
                        controller.enqueue(JSON.parse(buffer));
                        buffer = '';
                    } else {
                        buffer += c;
                    }
                }

                // Retain any leftovers.
                tail = buffer;
            },
            flush(controller) {
                // If there's unparsed content return an error. This shouldn't happen as means the
                // source (server) is doing something wrong.
                if (tail !== '') {
                    controller.error(new Error(`Unexpected trailing content: ${tail}`));
                }
            },
        });
    }
}
