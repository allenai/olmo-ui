import {
    isFirstMessage,
    isMessageStreamError,
    MessageClient,
    MessageStreamError,
    MessageStreamPart,
    V4CreateMessageRequest,
} from './Message';
import { ReadableJSONLStream } from './ReadableJSONLStream';

const messageClient = new MessageClient();

// This is a generator function. for more info, see MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
export const postMessageGenerator = async function* (
    newMessage: V4CreateMessageRequest,
    abortController: AbortController
) {
    const resp = await messageClient.sendMessage(newMessage, abortController);

    const rdr = resp.pipeThrough(new ReadableJSONLStream<MessageStreamPart>()).getReader();
    let partIndex = 0;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
        let part;
        // HACK: We're checking to see if the first part of the message arrives within 5s
        // This _should_ happen within the API but I was having trouble implementing it there
        if (partIndex === 1) {
            part = await Promise.race([
                rdr.read(),
                new Promise<never>((_resolve, reject) => {
                    setTimeout(() => {
                        reject(new MessageStreamError('', 'model_overloaded', 'Model overloaded'));
                    }, 5000);
                }),
            ]);
        } else {
            part = await rdr.read();
        }

        if (part.done) {
            break;
        }

        // A MessageStreamError could be encountered at any point.
        if (isMessageStreamError(part.value)) {
            throw new MessageStreamError(
                part.value.message,
                part.value.reason,
                `streaming response failed: ${part.value.error}`
            );
        }

        // The first part should always be a full response
        // If it's not, something has gone wrong and we want to exit quickly
        if (partIndex === 0 && !isFirstMessage(part.value)) {
            throw new Error(
                `malformed response, the first part must be a valid message: ${JSON.stringify(part.value)}`
            );
        }

        yield part.value;
        partIndex++;
    }
};
