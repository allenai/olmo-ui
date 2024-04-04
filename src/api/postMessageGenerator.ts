import {
    InferenceOpts,
    Message,
    MessageClient,
    MessagePost,
    MessageStreamPart,
    isFirstOrFullMessage,
    isMessageStreamError,
} from './Message';
import { ReadableJSONLStream } from './ReadableJSONLStream';

const messageClient = new MessageClient();

export const postMessageGenerator = async function* (
    newMessage: MessagePost,
    inferenceOptions: InferenceOpts,
    abortController: AbortController,
    parentMessageId?: Message['id']
) {
    const resp = await messageClient.sendMessage(
        newMessage,
        inferenceOptions,
        abortController,
        parentMessageId
    );

    const rdr = resp.pipeThrough(new ReadableJSONLStream<MessageStreamPart>()).getReader();
    let firstPart = true;
    while (true) {
        const part = await rdr.read();

        if (part.done) {
            break;
        }

        // A MessageStreamError could be encountered at any point.
        if (isMessageStreamError(part.value)) {
            throw new Error(`streaming response failed: ${part.value.error}`);
        }

        // The first part should always be a full response
        // If it's not, something has gone wrong and we want to exit quickly
        if (firstPart && !isFirstOrFullMessage(part.value)) {
            throw new Error(
                `malformed response, the first part must be a valid message: ${part.value}`
            );
        }

        yield part.value;
        firstPart = false;
    }
};
