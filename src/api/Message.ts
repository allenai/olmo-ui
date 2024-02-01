import { Label } from './Label';
import { Role } from './Role';
import { PaginationData } from './Schema';

export const MessageApiUrl = `${process.env.LLMX_API_URL}/v3/message`;
export const MessagesApiUrl = `${process.env.LLMX_API_URL}/v3/messages`;

export interface MessagePost {
    content: string;
    role?: string; // in the case of edited messages
    original?: string; // in the case of edited messages
    parent?: string;
    private?: boolean;
    prompt_template_id?: string;
    opts?: InferenceOpts;
    model?: string;
}

export interface Message {
    children?: Message[];
    content: string;
    snippet: string;
    created: Date;
    creator: string;
    deleted?: Date;
    id: string;
    labels: Label[];
    completion?: string;
    logprobs?: Logprob[];
    opts: InferenceOpts;
    original?: string;
    parent?: string;
    private?: boolean;
    role: Role;
    root: string;
    template: string;
    final: boolean;
    model?: string;
}

export interface MessageList {
    messages: Message[];
    meta: PaginationData;
}

export interface JSONMessageList {
    messages: JSONMessage[];
    meta: PaginationData;
}

export interface MessageChunk {
    message: string;
    content: string;
}

export interface MessageStreamError {
    message: string;
    error: string;
}

export interface InferenceOpts {
    max_tokens?: number;
    temperature?: number;
    n?: number;
    top_p?: number;
    logprobs?: number;
    stop?: string[];
}

export interface Logprob {
    token: string;
    offset: number;
    prob: number;
}

// The serialized representation, where certain fields (dates) are encoded as strings.
export interface JSONMessage extends Omit<Message, 'created' | 'deleted' | 'children'> {
    created: string;
    deleted?: string;
    children?: JSONMessage[];
}

export const parseMessage = (message: JSONMessage): Message => {
    return {
        ...message,
        created: new Date(message.created),
        deleted: message.deleted ? new Date(message.deleted) : undefined,
        children: message.children ? message.children.map((c) => parseMessage(c)) : undefined,
    };
};
