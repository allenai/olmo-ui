import {
    InferenceOpts,
    JSONMessage,
    Message,
    MessageChunk,
    MessageClient,
    MessagePost,
    MessageStreamError,
    isFirstOrFullMessage,
    parseMessage,
} from './Message';
import { ReadableJSONLStream } from './ReadableJSONLStream';

const messageClient = new MessageClient();

type Chunk = JSONMessage | MessageChunk | MessageStreamError;

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

    const rdr = resp.pipeThrough(new ReadableJSONLStream<Chunk>()).getReader();
    let firstPart = true;
    while (true) {
        const part = await rdr.read();
        console.debug(part);

        if (part.done) {
            break;
        }

        // A MessageStreamError could be encountered at any point.
        if ('error' in part.value) {
            throw new Error(`streaming response failed: ${part.value.error}`);
        }

        if (firstPart && !isFirstOrFullMessage(part.value)) {
            throw new Error(
                `malformed response, the first part must be a valid message: ${part.value}`
            );
        }

        yield part.value;
        firstPart = false;
    }
};
