import { NullishPartial } from '@/util';

import { Label } from './Label';
import { Thread } from './playgroundApi/thread';
import { SchemaHttpValidationError } from './playgroundApi/v5playgroundApiSchema';
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
    model_id?: string | null;
    model_host?: string | null;
    file_urls?: string[];
}

export interface MessageList {
    messages: Message[];
    meta: PaginationData;
}

export interface ThreadList {
    threads: Thread[];
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
    MODEL_OVERLOADED = 'model overloaded',
    BAD_CONNECTION = 'bad connection',
    VALUE_ERROR = 'value error',
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

export type MessageStreamPart = JSONMessage | MessageChunk | MessageStreamErrorType;

export const parseMessage = (message: JSONMessage): Message => {
    return {
        ...message,
        created: new Date(message.created),
        deleted: message.deleted ? new Date(message.deleted) : undefined,
        children: message.children ? message.children.map((c) => parseMessage(c)) : undefined,
    };
};

type StreamBadRequestErrorOptions = {
    status?: number;
    cause?: ErrorOptions['cause'];
};

// should clean these up along with mutations and such, leaving as-is for now
export class StreamBadRequestError extends Error {
    status?: number;
    description: string;
    type: string;

    constructor(description: string, type: string, options: StreamBadRequestErrorOptions = {}) {
        super(description, { cause: options.cause });

        this.description = description;
        this.name = 'StreamBadRequestError';
        this.status = options.status;
        this.type = type;
    }
}

export class StreamValidationError extends StreamBadRequestError {
    validationErrors: string[];

    constructor(error: SchemaHttpValidationError) {
        const validationErrors = error.errors.map((err) =>
            err.loc.length > 0 ? `${err.loc.join(', ')}: ${err.msg}` : err.msg
        );

        const description = validationErrors.join(';');
        super(`${error.title}: ${description}`, error.type, { status: error.status, cause: error });

        this.validationErrors = validationErrors;
    }
}
