import { Label } from './Label';
import { Role } from './Role';

export const MessageApiUrl = `${process.env.LLMX_API_URL}/v3/message`;
export const MessagesApiUrl = `${process.env.LLMX_API_URL}/v3/messages`;

export interface MessagePost {
    content: string;
    role?: string; // in the case of edited messages
    original?: string; // in the case of edited messages
    parent?: string;
    prompt_template_id?: string;
    opts?: InferenceOpts;
}

export interface Message {
    children?: Message[];
    content: string;
    created: Date;
    creator: string;
    deleted?: Date;
    id: string;
    labels: Label[];
    completion?: string;
    logprobs?: Logprob[];
    opts: InferenceOpts;
    parent?: string;
    role: Role;
    root: string;
    template: string;
    final: boolean;
}

export interface MessageListMeta {
    total: number;
    offset?: number;
    limit?: number;
}

export interface MessageList {
    messages: Message[];
    meta: MessageListMeta;
}

export interface JSONMessageList {
    messages: JSONMessage[];
    meta: MessageListMeta;
}

export interface MessageChunk {
    message: string;
    content: string;
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
