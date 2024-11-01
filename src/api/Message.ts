import { NullishPartial } from '@/util';

import { ClientBase } from './ClientBase';
import { Label } from './Label';
import { Role } from './Role';
import { InferenceOpts, PaginationData } from './Schema';

export const MessageApiUrl = `/v3/message`;
export const MessagesApiUrl = `/v3/messages`;

export type RequestInferenceOpts = NullishPartial<InferenceOpts>;

export interface Logprob {
    token: string;
    offset: number;
    prob: number;
}

export interface MessagePost {
    content: string;
    role?: string; // in the case of edited messages
    original?: string; // in the case of edited messages
    parent?: string;
    private?: boolean;
    prompt_template_id?: string;
    opts?: RequestInferenceOpts;
    model?: string;
}

export interface Message {
    children?: Message[] | null;
    content: string;
    snippet: string;
    created: Date;
    creator: string;
    deleted?: Date | null;
    id: string;
    labels: Label[];
    completion?: string | null;
    logprobs?: Logprob[] | null;
    model_type?: string | null;
    finish_reason?: string | null;
    opts: RequestInferenceOpts;
    original?: string | null;
    parent?: string | null;
    private?: boolean | null;
    role: Role;
    root: string;
    template?: string | null;
    final: boolean;
    model?: string | null;
}

export interface MessageList {
    messages: Message[];
    meta: PaginationData;
}

// The serialized representation, where certain fields (dates) are encoded as strings.
export interface JSONMessage extends Omit<Message, 'created' | 'deleted' | 'children'> {
    created: string;
    deleted?: string | null;
    children?: JSONMessage[] | null;
}

export interface MessagesResponse {
    messages: JSONMessage[];
    meta: PaginationData;
}

export interface MessageChunk {
    message: string;
    content: string;
}

export interface MessageStreamErrorType {
    message: string; // This stores the message ID
    error: string;
    reason: string;
}

export enum MessageStreamErrorReason {
    LENGTH = 'length',
    UNCLOSED_STREAM = 'unclosed stream',
    STOP = 'stop',
    ABORTED = 'aborted',
    FINALIZATION = 'finalization failure',
    GRPC = 'grpc inference failed',
    UNKNOWN = 'unkown',
}

export class MessageStreamError extends Error {
    messageId: string;
    finishReason: MessageStreamErrorReason;
    constructor(messageId: string, finishReason: string, message: string) {
        super(message);
        this.messageId = messageId;
        this.finishReason = MessageStreamError.mapFinishReason(finishReason);
    }

    static mapFinishReason(finishReason: string): MessageStreamErrorReason {
        if (
            Object.values(MessageStreamErrorReason).some(
                (reason) => (reason as string) === finishReason
            )
        ) {
            return finishReason as MessageStreamErrorReason;
        }

        return MessageStreamErrorReason.UNKNOWN;
    }
}

export interface FirstMessage extends JSONMessage {
    final: false;
}

export interface FinalMessage extends JSONMessage {
    final: true;
    children: JSONMessage[];
}

export type MessageStreamPart = JSONMessage | MessageChunk | MessageStreamErrorType;

export const isMessageWithMetadata = (message: MessageStreamPart): message is JSONMessage => {
    return 'id' in message;
};

export const isFirstMessage = (message: MessageStreamPart): message is FirstMessage => {
    return isMessageWithMetadata(message) && !message.final;
};

export const isFinalMessage = (message: MessageStreamPart): message is FinalMessage => {
    return isMessageWithMetadata(message) && message.final;
};

export const isMessageChunk = (message: MessageStreamPart): message is MessageChunk => {
    return 'content' in message && !isMessageWithMetadata(message);
};

export const isMessageStreamError = (
    message: MessageStreamPart
): message is MessageStreamErrorType => {
    return 'error' in message;
};

export const parseMessage = (message: JSONMessage): Message => {
    return {
        ...message,
        created: new Date(message.created),
        deleted: message.deleted ? new Date(message.deleted) : undefined,
        children: message.children ? message.children.map((c) => parseMessage(c)) : undefined,
    };
};

export class MessageClient extends ClientBase {
    getMessage = async (threadId: string): Promise<Message> => {
        const url = this.createURL(MessageApiUrl, threadId);

        const messageResponse = await this.fetch<JSONMessage>(url);

        return parseMessage(messageResponse);
    };

    deleteThread = async (threadId: string): Promise<void> => {
        const url = this.createURL(MessageApiUrl, threadId);

        return this.fetch(url, { method: 'DELETE' });
    };

    getAllThreads = async (
        offset: number = 0,
        creator?: string,
        limit?: number
    ): Promise<MessageList> => {
        const url = this.createURL(MessagesApiUrl);
        if (limit) {
            url.searchParams.set('limit', limit.toString());
        }

        url.searchParams.set('offset', offset.toString());

        if (creator != null) {
            url.searchParams.set('creator', creator);
        }

        const messagesResponse = await this.fetch<MessagesResponse>(url);

        const parsedMessages = messagesResponse.messages.map(parseMessage);

        return { messages: parsedMessages, meta: messagesResponse.meta };
    };

    sendMessage = async (
        newMessage: MessagePost,
        inferenceOptions: RequestInferenceOpts,
        abortController: AbortController,
        parentMessageId?: string
    ) => {
        const url = this.createURL(MessageApiUrl, 'stream');

        const request = {
            ...newMessage,
            parent: parentMessageId,
            opts: inferenceOptions,
        };

        // This opts out of the default fetch handling in this.fetch
        // Since this is a stream we can't unpack it the same way we do in this.fetch
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: await this.createStandardHeaders(),
            credentials: 'include',
            signal: abortController.signal,
        });

        if (response.status === 401) {
            this.login();
        }

        if (!response.ok) {
            if (response.status === 400) {
                const body = (await response.json()) as {
                    error: { code: number; message: string };
                };

                throw new StreamBadRequestError(response.status, body.error.message);
            }

            throw new Error(`POST ${url.toString()}: ${response.status} ${response.statusText}`);
        }
        if (!response.body) {
            throw new Error(`POST ${url.toString()}: missing response body`);
        }

        return response.body;
    };
}

export class StreamBadRequestError extends Error {
    status: number;
    description: string | undefined;

    constructor(status: number, description?: string) {
        super(`Received a Bad Request (${status}) response from the API: ${description}`);

        this.name = 'StreamBadRequestError';
        this.status = status;
        this.description = description;
    }
}
